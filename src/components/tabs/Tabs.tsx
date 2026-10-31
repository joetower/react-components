import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { useControllableState } from '../../hooks/useControllableState';
import { TabsContext, getPanelId, getTabId, useTabsContext } from './TabsContext';
import './tabs.css';

interface TabsBaseProps {
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  /** 'automatic' selects a tab as soon as it receives arrow-key focus. 'manual' requires Enter or Space. */
  activation?: 'automatic' | 'manual';
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  width?: 'components' | 'inner' | 'wide' | 'full';
  baseClass?: string;
}

/** Uncontrolled: Tabs owns the selection. `defaultValue` is the starting tab. */
interface UncontrolledProps extends TabsBaseProps {
  defaultValue: string;
  onValueChange?: (value: string) => void;
  value?: undefined;
}

/** Controlled: the parent owns the selection and updates it from `onValueChange`. */
interface ControlledProps extends TabsBaseProps {
  value: string;
  onValueChange: (value: string) => void;
  defaultValue?: undefined;
}

export type TabsProps = UncontrolledProps | ControlledProps;

/**
 * Compound component: the parts share state through Context, so callers compose them
 * freely and never pass the selected tab down by hand.
 *
 *   <Tabs defaultValue="a">
 *     <Tabs.List aria-label="Sections">
 *       <Tabs.Tab value="a">One</Tabs.Tab>
 *     </Tabs.List>
 *     <Tabs.Panel value="a">Content</Tabs.Panel>
 *   </Tabs>
 */
function TabsRoot({
  children,
  orientation = 'horizontal',
  activation = 'automatic',
  theme,
  width = 'components',
  baseClass,
  value,
  defaultValue,
  onValueChange,
}: TabsProps) {
  const baseId = useId();
  const [selectedValue, select] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? '',
    onChange: onValueChange,
  });

  // Memoized so consumers only re-render when something they read actually changes
  const context = useMemo(
    () => ({ baseId, selectedValue, select, activation, orientation }),
    [baseId, selectedValue, select, activation, orientation]
  );

  return (
    <TabsContext.Provider value={context}>
      <div
        className={['tabs', baseClass].filter(Boolean).join(' ')}
        data-component-theme={theme || 'primary'}
        data-component-width={width}
        data-orientation={orientation}
      >
        <div className="tabs__inner">{children}</div>
      </div>
    </TabsContext.Provider>
  );
}

interface TabListProps {
  children: ReactNode;
  /** A tablist needs a name. Pass `aria-label` or `aria-labelledby`. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

/** How much of the visible width one click on a scroll arrow moves, as a fraction. */
const SCROLL_STEP = 0.75;

/**
 * Scrolls the list just far enough that `tab` is fully visible, leaving room for the
 * scroll arrows that overlay both edges. Scrolls the list itself, never the page,
 * which `element.scrollIntoView()` can do by accident.
 */
function revealTab(list: HTMLElement, tab: HTMLElement, behavior: ScrollBehavior) {
  const edge = list.parentElement?.querySelector<HTMLElement>('.tabs__scroll')?.offsetWidth ?? 0;
  const listRect = list.getBoundingClientRect();
  const tabRect = tab.getBoundingClientRect();

  const hiddenAtStart = listRect.left + edge - tabRect.left;
  const hiddenAtEnd = tabRect.right - (listRect.right - edge);

  if (hiddenAtStart > 0) {
    list.scrollBy({ left: -hiddenAtStart, behavior });
  } else if (hiddenAtEnd > 0) {
    list.scrollBy({ left: hiddenAtEnd, behavior });
  }
}

function TabList({ children, ...aria }: TabListProps) {
  const { select, activation, orientation, selectedValue } = useTabsContext('Tabs.List');
  const listRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);
  const [overflow, setOverflow] = useState({ start: false, end: false });
  const isHorizontal = orientation === 'horizontal';

  // Reads the scroll position and records whether tabs are hidden on each side.
  // Math.abs makes it work for right-to-left too, where scrollLeft counts down from 0.
  const updateOverflow = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const maxScroll = list.scrollWidth - list.clientWidth;
    const position = Math.abs(list.scrollLeft);
    const next = { start: position > 1, end: position < maxScroll - 1 };
    // Returning the same object tells React nothing changed, so scrolling doesn't re-render needlessly
    setOverflow((previous) => (previous.start === next.start && previous.end === next.end ? previous : next));
  }, []);

  // Measure after every render, before paint, so tabs being added or removed are noticed
  useLayoutEffect(() => {
    if (isHorizontal) updateOverflow();
  });

  // Re-measure when the container or any tab changes size (window resize, web font loading, ...)
  useEffect(() => {
    const list = listRef.current;
    if (!isHorizontal || !list || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(list);
    Array.from(list.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  });

  // Keep the selected tab in view: on first render (the default may be off-screen) and when it changes
  useEffect(() => {
    const list = listRef.current;
    if (!isHorizontal || !list) return;
    const selected = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    if (selected) revealTab(list, selected, hasMountedRef.current ? 'auto' : 'instant');
    hasMountedRef.current = true;
  }, [selectedValue, isHorizontal]);

  // `direction` is logical: -1 scrolls toward the start of the list, 1 toward the end
  const scrollByPage = (direction: -1 | 1) => {
    const list = listRef.current;
    if (!list) return;
    const isRtl = getComputedStyle(list).direction === 'rtl';
    const physical = isRtl ? -direction : direction;
    list.scrollBy({ left: physical * list.clientWidth * SCROLL_STEP });
  };

  // WAI-ARIA tabs pattern: arrows move focus between tabs, Home/End jump to the ends.
  // Enter and Space already work because each tab is a real <button>.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? []);
    const current = tabs.indexOf((event.target as HTMLElement).closest<HTMLButtonElement>('[role="tab"]') as HTMLButtonElement);
    if (current === -1) return;

    const previousKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

    let next: number;
    switch (event.key) {
      case nextKey:
        next = (current + 1) % tabs.length;
        break;
      case previousKey:
        next = (current - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    tabs[next].focus();
    if (activation === 'automatic') {
      select(tabs[next].dataset.value as string);
    }
  };

  const tablist = (
    <div
      ref={listRef}
      className="tabs__list"
      role="tablist"
      aria-orientation={orientation}
      onKeyDown={handleKeyDown}
      onScroll={isHorizontal ? updateOverflow : undefined}
      {...aria}
    >
      {children}
    </div>
  );

  // Vertical lists don't scroll sideways, so they need no arrows
  if (!isHorizontal) return tablist;

  // The arrows are for mouse and touch users. Keyboard and screen reader users already have
  // the arrow keys, which also scroll focused tabs into view, so the buttons are hidden from
  // assistive technology and kept out of the Tab order (otherwise they'd be a confusing
  // extra stop, and a screen reader would announce unlabelled buttons).
  return (
    <div className="tabs__list-wrapper">
      <button
        type="button"
        className="tabs__scroll tabs__scroll--start"
        aria-hidden="true"
        tabIndex={-1}
        data-visible={overflow.start}
        // Stops the click from moving focus off the tab the user was on
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => scrollByPage(-1)}
      >
        <span className="tabs__scroll-icon" />
      </button>
      {tablist}
      <button
        type="button"
        className="tabs__scroll tabs__scroll--end"
        aria-hidden="true"
        tabIndex={-1}
        data-visible={overflow.end}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => scrollByPage(1)}
      >
        <span className="tabs__scroll-icon" />
      </button>
    </div>
  );
}

interface TabProps {
  /** Unique within this Tabs. Links the tab to its panel, so it must match a `Tabs.Panel` value. */
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

function Tab({ value, children, disabled }: TabProps) {
  const { baseId, selectedValue, select } = useTabsContext('Tabs.Tab');
  const isSelected = value === selectedValue;

  return (
    <button
      type="button"
      role="tab"
      id={getTabId(baseId, value)}
      className="tabs__tab"
      aria-selected={isSelected}
      aria-controls={getPanelId(baseId, value)}
      // Roving tabindex: the whole tablist is a single Tab stop, landing on the selected tab
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      data-value={value}
      data-state={isSelected ? 'selected' : 'unselected'}
      onClick={() => select(value)}
    >
      {children}
    </button>
  );
}

interface TabPanelProps {
  value: string;
  children: ReactNode;
}

function TabPanel({ value, children }: TabPanelProps) {
  const { baseId, selectedValue } = useTabsContext('Tabs.Panel');
  const isSelected = value === selectedValue;

  return (
    <div
      role="tabpanel"
      id={getPanelId(baseId, value)}
      className="tabs__panel text-block"
      aria-labelledby={getTabId(baseId, value)}
      // Panels stay mounted but hidden, so their internal state (a half-filled form, say) survives tab switches
      hidden={!isSelected}
      // Lets keyboard users reach panels that contain no focusable content of their own
      tabIndex={0}
    >
      {children}
    </div>
  );
}

const Tabs = Object.assign(TabsRoot, {
  List: TabList,
  Tab,
  Panel: TabPanel,
});

export default Tabs;
