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
 * Scrolls the list just far enough that `tab` is fully visible. Scrolls the list itself,
 * never the page, which `element.scrollIntoView()` can do by accident.
 */
function revealTab(list: HTMLElement, tab: HTMLElement, behavior: ScrollBehavior) {
  const listRect = list.getBoundingClientRect();
  const tabRect = tab.getBoundingClientRect();

  if (tabRect.left < listRect.left) {
    list.scrollBy({ left: tabRect.left - listRect.left, behavior });
  } else if (tabRect.right > listRect.right) {
    list.scrollBy({ left: tabRect.right - listRect.right, behavior });
  }
}

interface OverflowState {
  /** The tabs are wider than the space available, so scroll arrows are needed at all */
  needsScroll: boolean;
  /** Tabs are hidden toward the start (the left, in a left-to-right layout) */
  canScrollStart: boolean;
  /** Tabs are hidden toward the end */
  canScrollEnd: boolean;
}

const NO_OVERFLOW: OverflowState = { needsScroll: false, canScrollStart: false, canScrollEnd: false };

function TabList({ children, ...aria }: TabListProps) {
  const { select, activation, orientation, selectedValue } = useTabsContext('Tabs.List');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);
  const [overflow, setOverflow] = useState<OverflowState>(NO_OVERFLOW);
  const isHorizontal = orientation === 'horizontal';

  // Works from where the tabs actually are on screen, not from scrollLeft, which differs
  // between browsers (and goes negative in right-to-left layouts).
  const updateOverflow = useCallback(() => {
    const list = listRef.current;
    const wrapper = wrapperRef.current;
    if (!list || !wrapper || list.children.length === 0) return;

    const listRect = list.getBoundingClientRect();
    let contentLeft = Infinity;
    let contentRight = -Infinity;
    for (const tab of Array.from(list.children)) {
      const rect = tab.getBoundingClientRect();
      contentLeft = Math.min(contentLeft, rect.left);
      contentRight = Math.max(contentRight, rect.right);
    }

    // Compared with the whole wrapper, not the list: the arrows take space from the list when
    // they appear, and a decision based on the list would flip-flop as they come and go.
    const needsScroll = contentRight - contentLeft > wrapper.getBoundingClientRect().width + 0.5;

    const hiddenOnLeft = contentLeft < listRect.left - 1;
    const hiddenOnRight = contentRight > listRect.right + 1;
    const isRtl = getComputedStyle(list).direction === 'rtl';

    const next: OverflowState = {
      needsScroll,
      canScrollStart: isRtl ? hiddenOnRight : hiddenOnLeft,
      canScrollEnd: isRtl ? hiddenOnLeft : hiddenOnRight,
    };

    // Returning the same object tells React nothing changed, so scrolling doesn't re-render needlessly
    setOverflow((previous) =>
      previous.needsScroll === next.needsScroll &&
      previous.canScrollStart === next.canScrollStart &&
      previous.canScrollEnd === next.canScrollEnd
        ? previous
        : next
    );
  }, []);

  // Measure after every render, before paint, so tabs being added or removed are noticed
  useLayoutEffect(() => {
    if (isHorizontal) updateOverflow();
  });

  // Re-measure when the container or any tab changes size (window resize, web font loading, ...)
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const list = listRef.current;
    if (!isHorizontal || !wrapper || !list || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(updateOverflow);
    observer.observe(wrapper);
    observer.observe(list);
    Array.from(list.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  });

  const revealSelected = useCallback((behavior: ScrollBehavior) => {
    const list = listRef.current;
    const selected = list?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    if (list && selected) revealTab(list, selected, behavior);
  }, []);

  // The arrows appearing or disappearing changes how wide the list is, which can push the
  // selected tab out of view (for example when the default tab is the last one). Fix it
  // immediately and without animation, before the user sees it.
  useLayoutEffect(() => {
    if (isHorizontal) revealSelected('instant');
  }, [isHorizontal, overflow.needsScroll, revealSelected]);

  // When the user picks a different tab, bring it into view smoothly
  useEffect(() => {
    if (!isHorizontal) return;
    if (hasMountedRef.current) revealSelected('auto');
    hasMountedRef.current = true;
  }, [selectedValue, isHorizontal, revealSelected]);

  // `direction` is logical: -1 scrolls toward the start of the list, 1 toward the end.
  // No `behavior` is passed on purpose: CSS `scroll-behavior` decides, and it's turned
  // off for people who prefer reduced motion.
  const scrollByPage = (direction: -1 | 1) => {
    const list = listRef.current;
    if (!list) return;
    const isRtl = getComputedStyle(list).direction === 'rtl';
    list.scrollBy({ left: (isRtl ? -direction : direction) * list.clientWidth * SCROLL_STEP });
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
    // Scroll the list ourselves instead of leaving it to the browser's focus scrolling, which
    // doesn't reliably reveal a hidden tab (it matters most in manual activation, where
    // moving focus doesn't change the selection). preventScroll also stops the page jumping.
    tabs[next].focus({ preventScroll: true });
    if (listRef.current) revealTab(listRef.current, tabs[next], 'auto');
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

  // The arrows sit beside the tabs, not on top of them, so they never hide a tab or steal a tap
  // meant for one. They only exist when the tabs don't fit. Once there's nothing left to reveal in
  // a direction, that arrow is dimmed rather than removed, so the list never changes width while scrolling.
  //
  // They're for mouse and touch users. Keyboard and screen reader users already have the arrow keys,
  // which also scroll focused tabs into view, so the buttons are hidden from assistive technology
  // and kept out of the Tab order.
  return (
    <div ref={wrapperRef} className="tabs__list-wrapper">
      {overflow.needsScroll && (
        <button
          type="button"
          className="tabs__scroll tabs__scroll--start"
          aria-hidden="true"
          tabIndex={-1}
          disabled={!overflow.canScrollStart}
          // Stops the click from moving focus off the tab the user was on
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => scrollByPage(-1)}
        >
          <span className="tabs__scroll-icon" />
        </button>
      )}
      {tablist}
      {overflow.needsScroll && (
        <button
          type="button"
          className="tabs__scroll tabs__scroll--end"
          aria-hidden="true"
          tabIndex={-1}
          disabled={!overflow.canScrollEnd}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => scrollByPage(1)}
        >
          <span className="tabs__scroll-icon" />
        </button>
      )}
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
      // Lets CSS reserve the width of the bold (selected) text, so selecting a tab never resizes it
      data-label={typeof children === 'string' ? children : undefined}
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
      className="tabs__panel"
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
