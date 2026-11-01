/**
 * The Combobox's interdependent UI state, kept in one pure reducer.
 *
 * Why a reducer instead of several `useState`s: these values change together.
 * Typing opens the list, clears the highlighted option and sets the filter, all at once.
 * Doing that with separate setters risks a render where they disagree. A reducer makes each
 * user action one named transition that can be unit-tested without React.
 *
 * What is deliberately NOT here:
 * - The selected option: it can be controlled by the parent, so it lives in `useControllableState`.
 * - The filtered list: it's derived from `query` and the options during render, so it can never go stale.
 */

export interface ComboboxState<T> {
  /** What the input displays. Equals the selected label until the user types. */
  inputValue: string;
  /** What the user typed to filter by. Empty means "show everything", even when the input shows a label. */
  query: string;
  isOpen: boolean;
  /** Index of the highlighted option in the visible list, or -1 for none. */
  activeIndex: number;
  /** Only meaningful in async mode. */
  status: 'idle' | 'loading' | 'error';
  /** Only used in async mode: the latest results from `loadOptions`. */
  loadedOptions: T[];
}

export type ComboboxAction<T> =
  | { type: 'input'; value: string }
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'setActive'; index: number }
  /** An option was chosen: show its label and close. */
  | { type: 'select'; label: string }
  /** Restore the input to the selected label (blur, or the selection changed from outside) and close. */
  | { type: 'reset'; label: string }
  | { type: 'clear' }
  | { type: 'loadStart' }
  | { type: 'loadSuccess'; options: T[] }
  | { type: 'loadError' };

export function createInitialState<T>(initialLabel: string, isAsync: boolean): ComboboxState<T> {
  return {
    inputValue: initialLabel,
    query: '',
    isOpen: false,
    activeIndex: -1,
    // Start in "loading" for async mode so the first open never flashes a "no results" message
    status: isAsync ? 'loading' : 'idle',
    loadedOptions: [],
  };
}

export function comboboxReducer<T>(state: ComboboxState<T>, action: ComboboxAction<T>): ComboboxState<T> {
  switch (action.type) {
    case 'input':
      return { ...state, inputValue: action.value, query: action.value, isOpen: true, activeIndex: -1 };

    case 'open':
      // Returning the same object tells React nothing changed, so it skips the re-render
      return state.isOpen ? state : { ...state, isOpen: true };

    case 'close':
      return state.isOpen || state.activeIndex !== -1 ? { ...state, isOpen: false, activeIndex: -1 } : state;

    case 'setActive':
      return state.activeIndex === action.index ? state : { ...state, activeIndex: action.index };

    case 'select':
    case 'reset':
      return { ...state, inputValue: action.label, query: '', isOpen: false, activeIndex: -1 };

    case 'clear':
      return { ...state, inputValue: '', query: '', activeIndex: -1 };

    case 'loadStart':
      return state.status === 'loading' ? state : { ...state, status: 'loading' };

    case 'loadSuccess':
      // New results mean the old highlighted index may now point at a different option
      return { ...state, status: 'idle', loadedOptions: action.options, activeIndex: -1 };

    case 'loadError':
      return { ...state, status: 'error', loadedOptions: [], activeIndex: -1 };

    default: {
      // If a new action type is added and not handled above, this line stops compiling
      const unhandled: never = action;
      return unhandled;
    }
  }
}

/**
 * Finds the next option that isn't disabled, wrapping around the ends.
 * `from` of -1 means "nothing is highlighted yet". Returns -1 if every option is disabled.
 */
export function getNextEnabledIndex(options: { disabled?: boolean }[], from: number, direction: 1 | -1): number {
  const count = options.length;
  if (count === 0) return -1;

  // From "nothing highlighted", going backwards should land on the last option
  const start = from === -1 && direction === -1 ? 0 : from;

  for (let step = 1; step <= count; step++) {
    // The double modulo keeps the result positive when stepping below 0
    const index = (((start + direction * step) % count) + count) % count;
    if (!options[index].disabled) return index;
  }
  return -1;
}

/** Lower-cases and strips accents, so "zur" matches "Zürich". */
export function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}
