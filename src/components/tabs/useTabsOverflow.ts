import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getRevealOffset, getScrollIndicator, getScrollOffset } from './tabsOverflow';
import type { ScrollIndicator, Side } from './tabsOverflow';

interface OverflowState {
  /** The tabs are wider than the space available, so scroll arrows are needed at all */
  needsScroll: boolean;
  /** Which sides have tabs hidden. Also published as `data-scroll-indicator` for styling. */
  indicator: ScrollIndicator;
  isRtl: boolean;
}

const NO_OVERFLOW: OverflowState = { needsScroll: false, indicator: 'none', isRtl: false };

const toSpan = ({ left, right }: DOMRect) => ({ left, right });

/**
 * Sideways scrolling for a horizontal tab list. This is the React version of the Drupal
 * `tabsNavScroll` behavior: it tracks which sides have hidden tabs, moves the list a tab at a
 * time for the arrows, and brings a focused or selected tab into view.
 *
 * What changed in the move from Drupal:
 *  - Listeners are attached and removed by effects, so there is no WeakSet "already processed"
 *    guard, and React StrictMode's double mount is harmless.
 *  - A ResizeObserver replaces the debounced window `resize` listener. It also notices a web
 *    font loading or tabs being added, which a window resize never reports.
 *  - The result is React state, so the arrows re-render themselves. Drupal pushed it into the
 *    DOM with `setAttribute`.
 *
 * `selectedValue` is only used to notice when the selection changes.
 */
export function useTabsOverflow({ enabled, selectedValue }: { enabled: boolean; selectedValue: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);
  const [overflow, setOverflow] = useState<OverflowState>(NO_OVERFLOW);

  const getTabs = useCallback(() => Array.from(listRef.current?.children ?? []) as HTMLElement[], []);

  // Works from where the tabs actually are on screen, not from scrollLeft, which differs
  // between browsers (and goes negative in right-to-left layouts).
  const measure = useCallback(() => {
    const list = listRef.current;
    const wrapper = wrapperRef.current;
    const tabs = getTabs();
    if (!list || !wrapper || tabs.length === 0) return;

    const spans = tabs.map((tab) => toSpan(tab.getBoundingClientRect()));
    const contentWidth = Math.max(...spans.map((s) => s.right)) - Math.min(...spans.map((s) => s.left));

    // Compared with the whole wrapper, not the list: the arrows take space from the list when
    // they appear, and a decision based on the list would flip-flop as they come and go.
    const needsScroll = contentWidth > wrapper.getBoundingClientRect().width + 0.5;

    const next: OverflowState = {
      needsScroll,
      indicator: getScrollIndicator(spans, toSpan(list.getBoundingClientRect())),
      isRtl: getComputedStyle(list).direction === 'rtl',
    };

    // Returning the same object tells React nothing changed, so scrolling doesn't re-render needlessly
    setOverflow((previous) =>
      previous.needsScroll === next.needsScroll &&
      previous.indicator === next.indicator &&
      previous.isRtl === next.isRtl
        ? previous
        : next
    );
  }, [getTabs]);

  // Measure after every render, before paint, so tabs being added or removed are noticed
  useLayoutEffect(() => {
    if (enabled) measure();
  });

  // Re-measure when the container or any tab changes size (window resize, web font loading, ...)
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const list = listRef.current;
    if (!enabled || !wrapper || !list || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    observer.observe(list);
    getTabs().forEach((tab) => observer.observe(tab));
    return () => observer.disconnect();
  });

  /** Scrolls the list just far enough that `tab` is fully visible. Never scrolls the page. */
  const revealTab = useCallback((tab: HTMLElement, behavior: ScrollBehavior = 'auto') => {
    const list = listRef.current;
    if (!list) return;
    const offset = getRevealOffset(toSpan(tab.getBoundingClientRect()), toSpan(list.getBoundingClientRect()));
    if (offset !== 0) list.scrollBy({ left: offset, behavior });
  }, []);

  const revealSelected = useCallback(
    (behavior: ScrollBehavior) => {
      const selected = listRef.current?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
      if (selected) revealTab(selected, behavior);
    },
    [revealTab]
  );

  // The arrows appearing or disappearing changes how wide the list is, which can push the
  // selected tab out of view (for example when the default tab is the last one). Fix it
  // immediately and without animation, before the user sees it.
  useLayoutEffect(() => {
    if (enabled) revealSelected('instant');
  }, [enabled, overflow.needsScroll, revealSelected]);

  // When the user picks a different tab, bring it into view smoothly
  useEffect(() => {
    if (!enabled) return;
    if (hasMountedRef.current) revealSelected('auto');
    hasMountedRef.current = true;
  }, [selectedValue, enabled, revealSelected]);

  /**
   * One click on a scroll arrow. `side` is where the tabs are being revealed, in start/end terms:
   * 'start' is the left in a left-to-right layout and the right in a right-to-left one.
   *
   * No `behavior` is passed on purpose: CSS `scroll-behavior` decides, and it's turned off for
   * people who prefer reduced motion.
   */
  const scrollTabs = (direction: 'start' | 'end') => {
    const list = listRef.current;
    if (!list) return;
    const physical: Side = (direction === 'start') !== overflow.isRtl ? 'left' : 'right';
    const offset = getScrollOffset(getTabs().map((tab) => toSpan(tab.getBoundingClientRect())), toSpan(list.getBoundingClientRect()), physical);
    if (offset !== 0) list.scrollBy({ left: offset });
  };

  const { indicator, isRtl } = overflow;
  const hiddenAtStart = isRtl ? 'right' : 'left';
  const hiddenAtEnd = isRtl ? 'left' : 'right';

  return {
    wrapperRef,
    listRef,
    measure,
    revealTab,
    scrollTabs,
    needsScroll: overflow.needsScroll,
    indicator,
    canScrollStart: indicator === 'both' || indicator === hiddenAtStart,
    canScrollEnd: indicator === 'both' || indicator === hiddenAtEnd,
  };
}
