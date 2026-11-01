import { useEffect, useId, useMemo, useReducer, useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { useControllableState } from '../../hooks/useControllableState';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { comboboxReducer, createInitialState, getNextEnabledIndex, normalizeText } from './comboboxReducer';
import './combobox.css';

/** The minimum shape of an option. Extend it with your own fields and use `renderOption` to show them. */
export interface ComboboxOption {
  /** Unique and stable. Used for identity, DOM ids, and form submission. */
  value: string;
  /** Shown in the input once selected, and what local filtering searches. */
  label: string;
  disabled?: boolean;
}

interface ComboboxBaseProps<T extends ComboboxOption> {
  /** The visible label. A combobox must have one. */
  label: string;
  placeholder?: string;
  /** Shown when nothing matches */
  noOptionsText?: string;
  /** Shown when `loadOptions` rejects */
  errorText?: string;
  disabled?: boolean;
  /** When set, a hidden input submits the selected option's `value` with a surrounding <form> */
  name?: string;
  /** Customize how each option looks. The text of `label` is still what screen readers use for the selected value. */
  renderOption?: (option: T, state: { active: boolean; selected: boolean }) => ReactNode;
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  width?: 'components' | 'inner' | 'wide' | 'full';
  baseClass?: string;
}

/** Local mode: the component filters a list you already have. */
interface LocalOptionsProps<T extends ComboboxOption> {
  options: T[];
  loadOptions?: undefined;
  debounceMs?: undefined;
}

/**
 * Async mode: the component asks you for matches. It debounces typing, cancels requests
 * that are no longer wanted (`signal` aborts), and shows loading and error states.
 * Pass the signal to `fetch` so cancelling really stops the network request.
 */
interface AsyncOptionsProps<T extends ComboboxOption> {
  loadOptions: (query: string, signal: AbortSignal) => Promise<T[]>;
  /** Wait this long after the last keystroke before loading. Default 250. */
  debounceMs?: number;
  options?: undefined;
}

/** Uncontrolled: the component owns the selection. */
interface UncontrolledProps<T extends ComboboxOption> {
  defaultValue?: T | null;
  onValueChange?: (value: T | null) => void;
  value?: undefined;
}

/**
 * Controlled: the parent owns the selection. The value is the whole option, not just its
 * `value` string, because in async mode the option may not be in the current results,
 * and the component still needs its label to show in the input.
 */
interface ControlledProps<T extends ComboboxOption> {
  value: T | null;
  onValueChange: (value: T | null) => void;
  defaultValue?: undefined;
}

// Two independent choices (local vs. async, controlled vs. uncontrolled), each a discriminated union.
// TypeScript rejects every invalid mix: both option sources, or `value` without `onValueChange`.
export type ComboboxProps<T extends ComboboxOption> = ComboboxBaseProps<T> &
  (LocalOptionsProps<T> | AsyncOptionsProps<T>) &
  (UncontrolledProps<T> | ControlledProps<T>);

export default function Combobox<T extends ComboboxOption>(props: ComboboxProps<T>) {
  const {
    label,
    placeholder,
    noOptionsText = 'No results found',
    errorText = 'Results could not be loaded. Try typing again.',
    disabled,
    name,
    renderOption,
    theme,
    width = 'components',
    baseClass,
    options,
    loadOptions,
    debounceMs = 250,
    value,
    defaultValue,
    onValueChange,
  } = props;

  const isAsync = loadOptions !== undefined;
  const baseId = useId();
  const inputId = `${baseId}-input`;
  const labelId = `${baseId}-label`;
  const listboxId = `${baseId}-listbox`;
  const getOptionId = (optionValue: string) => `${baseId}-option-${optionValue}`;
  const listRef = useRef<HTMLUListElement>(null);

  const [selected, setSelected] = useControllableState<T | null>({
    value,
    defaultValue: defaultValue ?? null,
    onChange: onValueChange,
  });
  const selectedLabel = selected?.label ?? '';

  const [state, dispatch] = useReducer(comboboxReducer<T>, undefined, () =>
    createInitialState<T>(selectedLabel, isAsync)
  );

  // --- Deriving the visible list -------------------------------------------------------------
  // Local mode filters during render, so the list can never be out of step with the query.
  const visibleOptions = useMemo<T[]>(() => {
    if (isAsync) return state.loadedOptions;
    const needle = normalizeText(state.query.trim());
    return needle ? (options ?? []).filter((option) => normalizeText(option.label).includes(needle)) : (options ?? []);
  }, [isAsync, state.loadedOptions, state.query, options]);

  // --- Keeping the input in step with the selection -------------------------------------------
  // The selection can change from outside (a controlled parent), so mirror it into the input.
  useEffect(() => {
    dispatch({ type: 'reset', label: selectedLabel });
  }, [selectedLabel]);

  // --- Async loading -------------------------------------------------------------------------
  const debouncedQuery = useDebouncedValue(state.query, debounceMs);

  // The "latest ref" pattern: always call the newest `loadOptions` without listing it as an
  // effect dependency. If it were a dependency, a parent passing an inline arrow function
  // (a new function every render) would restart the effect on every render, in an endless loop.
  const loadOptionsRef = useRef(loadOptions);
  useEffect(() => {
    loadOptionsRef.current = loadOptions;
  });

  useEffect(() => {
    const load = loadOptionsRef.current;
    if (!load || !state.isOpen) return;

    // One controller per request. Cleanup aborts it, so a slow response for an old query
    // can never arrive after, and overwrite, the response for the current query.
    const controller = new AbortController();
    dispatch({ type: 'loadStart' });

    load(debouncedQuery, controller.signal).then(
      (results) => {
        if (!controller.signal.aborted) dispatch({ type: 'loadSuccess', options: results });
      },
      () => {
        if (!controller.signal.aborted) dispatch({ type: 'loadError' });
      }
    );

    return () => controller.abort();
  }, [state.isOpen, debouncedQuery]);

  // Between the last keystroke and the debounced request, results on screen are already stale
  const isPending = isAsync && state.isOpen && state.query !== debouncedQuery;
  const isLoading = isAsync && (state.status === 'loading' || isPending);
  const hasError = isAsync && state.status === 'error' && !isLoading;

  // --- Active option -------------------------------------------------------------------------
  const activeOption = state.isOpen ? visibleOptions[state.activeIndex] : undefined;

  // Keep the highlighted option scrolled into view inside the list. This moves the list only;
  // scrollIntoView() could also scroll the whole page.
  useEffect(() => {
    const list = listRef.current;
    const element = list?.children[state.activeIndex] as HTMLElement | undefined;
    if (!list || !element) return;

    if (element.offsetTop < list.scrollTop) {
      list.scrollTop = element.offsetTop;
    } else if (element.offsetTop + element.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = element.offsetTop + element.offsetHeight - list.clientHeight;
    }
  }, [state.activeIndex, state.isOpen]);

  // --- Actions -------------------------------------------------------------------------------
  const commit = (option: T) => {
    if (option.disabled) return;
    if (option.value !== selected?.value) setSelected(option);
    dispatch({ type: 'select', label: option.label });
  };

  // Opening starts on the selected option when there is one, like a native <select>: it's
  // highlighted and the list scrolls to it. With nothing selected, the arrow keys start at the
  // first (down) or last (up) option, and a click leaves nothing highlighted.
  const openList = (direction: 1 | -1 | null) => {
    const selectedIndex = selected ? visibleOptions.findIndex((option) => option.value === selected.value) : -1;
    dispatch({ type: 'open' });
    dispatch({
      type: 'setActive',
      index:
        selectedIndex !== -1 ? selectedIndex : direction ? getNextEnabledIndex(visibleOptions, -1, direction) : -1,
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        const direction = event.key === 'ArrowDown' ? 1 : -1;

        if (!state.isOpen) {
          openList(direction);
        } else {
          dispatch({ type: 'setActive', index: getNextEnabledIndex(visibleOptions, state.activeIndex, direction) });
        }
        break;
      }

      case 'Enter':
        // Only take over Enter when it means "choose this option". Otherwise a surrounding form can submit.
        if (state.isOpen && activeOption) {
          event.preventDefault();
          commit(activeOption);
        }
        break;

      case 'Escape':
        if (state.isOpen) {
          // Stop the event so Escape closes only the list, not a dialog the combobox sits in
          event.preventDefault();
          event.stopPropagation();
          dispatch({ type: 'close' });
        } else if (state.inputValue || selected) {
          // A second Escape clears the field
          event.preventDefault();
          event.stopPropagation();
          setSelected(null);
          dispatch({ type: 'clear' });
        }
        break;

      // Home, End, Left and Right are left alone: in an editable input they move the text cursor.
    }
  };

  // --- Screen reader announcement ------------------------------------------------------------
  // The focus stays in the input, so a screen reader never "sees" the list change.
  // A live region says what happened.
  let statusMessage = '';
  if (state.isOpen) {
    if (hasError) statusMessage = errorText;
    else if (isLoading) statusMessage = 'Loading results.';
    else if (visibleOptions.length === 0) statusMessage = noOptionsText;
    else statusMessage = `${visibleOptions.length} ${visibleOptions.length === 1 ? 'result' : 'results'} available.`;
  }

  // The same message shown to sighted users, without options in the way. Hidden from assistive
  // technology because the live region above already announces it.
  let visibleMessage = '';
  if (hasError) visibleMessage = errorText;
  else if (isLoading) visibleMessage = 'Loading…';
  else if (visibleOptions.length === 0) visibleMessage = noOptionsText;

  return (
    <div
      className={['combobox', baseClass].filter(Boolean).join(' ')}
      data-component-theme={theme || 'primary'}
      data-component-width={width}
    >
      <div className="combobox__inner">
        <label id={labelId} htmlFor={inputId} className="combobox__label">
          {label}
        </label>

        <div className="combobox__field" data-state={state.isOpen ? 'open' : 'closed'}>
          <input
            id={inputId}
            className="combobox__input"
            type="text"
            role="combobox"
            aria-expanded={state.isOpen}
            aria-controls={listboxId}
            aria-autocomplete="list"
            // Focus stays in the input. This tells assistive technology which option is "current".
            aria-activedescendant={activeOption ? getOptionId(activeOption.value) : undefined}
            autoComplete="off"
            spellCheck={false}
            placeholder={placeholder}
            disabled={disabled}
            value={state.inputValue}
            onChange={(event) => {
              const next = event.target.value;
              dispatch({ type: 'input', value: next });
              // Emptying the field means "no selection"
              if (next === '' && selected) setSelected(null);
            }}
            onClick={() => {
              // Only when closed, so clicking to place the text cursor doesn't move the highlight
              if (!state.isOpen) openList(null);
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => dispatch({ type: 'reset', label: selectedLabel })}
          />
          <span className="combobox__icon" aria-hidden="true" />
        </div>

        <div
          className="combobox__popup"
          hidden={!state.isOpen}
          // Clicking inside the popup must not blur the input, or the list would close before the click lands
          onMouseDown={(event) => event.preventDefault()}
        >
          {visibleMessage && (
            <div className="combobox__message" aria-hidden="true">
              {visibleMessage}
            </div>
          )}
          <ul
            ref={listRef}
            id={listboxId}
            className="combobox__listbox"
            role="listbox"
            aria-labelledby={labelId}
            aria-busy={isLoading}
            hidden={visibleOptions.length === 0}
          >
            {visibleOptions.map((option, index) => {
              const isActive = index === state.activeIndex;
              const isSelected = option.value === selected?.value;

              return (
                <li
                  key={option.value}
                  id={getOptionId(option.value)}
                  className="combobox__option"
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  data-active={isActive}
                  onMouseMove={() => {
                    if (!option.disabled) dispatch({ type: 'setActive', index });
                  }}
                  onClick={() => commit(option)}
                >
                  {renderOption ? renderOption(option, { active: isActive, selected: isSelected }) : option.label}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="combobox__status" role="status">
          {statusMessage}
        </div>

        {name && <input type="hidden" name={name} value={selected?.value ?? ''} />}
      </div>
    </div>
  );
}
