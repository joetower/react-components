/**
 * The geometry behind Tabs' sideways scrolling, as pure functions that work on plain numbers.
 *
 * This is the logic of the Drupal `tabsNavScroll` behavior, with the DOM reading and writing
 * taken out of it, so it can be unit tested without a browser:
 *
 *   setOverflow()     -> getScrollIndicator()
 *   getFirstVisible() -> getScrollOffset(..., 'right')
 *   getLastHidden()   -> getScrollOffset(..., 'left')
 *   ensureVisible()   -> getRevealOffset()
 *
 * Everything here is physical (left and right), as on screen. That keeps it correct in
 * right-to-left layouts too, where scrollLeft is negative and differs between browsers.
 */

/** The horizontal extent of an element on screen, e.g. from `getBoundingClientRect()` */
export interface Span {
  left: number;
  right: number;
}

/** Which sides have tabs hidden past the edge of the list */
export type ScrollIndicator = 'none' | 'left' | 'right' | 'both';

export type Side = 'left' | 'right';

/** Sub-pixel layout rounding shouldn't count as a hidden tab (or a visible one) */
export const EDGE_TOLERANCE = 1;

/** Which sides of `view` have tabs sticking out past them. Called "setOverflow" in the Drupal version. */
export function getScrollIndicator(tabs: Span[], view: Span): ScrollIndicator {
  const hiddenLeft = tabs.some((tab) => tab.left < view.left - EDGE_TOLERANCE);
  const hiddenRight = tabs.some((tab) => tab.right > view.right + EDGE_TOLERANCE);

  if (hiddenLeft && hiddenRight) return 'both';
  if (hiddenLeft) return 'left';
  if (hiddenRight) return 'right';
  return 'none';
}

/**
 * How far to scroll for one click on a scroll arrow. The result is a distance to pass to
 * `scrollBy({ left })`, positive to scroll right. Arrows move by tabs, not by a fixed amount,
 * so the list always comes to rest with a tab flush against the edge.
 *
 * 'right' (reveal what's hidden on the right): the second tab that starts inside the view
 * becomes the first one. 'left': the last tab that is cut off on the left is brought flush
 * to the left edge.
 */
export function getScrollOffset(tabs: Span[], view: Span, side: Side): number {
  if (side === 'left') {
    const hidden = tabs.filter((tab) => tab.left < view.left - EDGE_TOLERANCE);
    if (hidden.length === 0) return 0;
    const lastHidden = hidden.reduce((nearest, tab) => (tab.left > nearest.left ? tab : nearest));
    return lastHidden.left - view.left;
  }

  const startingInside = tabs
    .filter((tab) => tab.left > view.left + EDGE_TOLERANCE)
    .sort((a, b) => a.left - b.left);

  // The Drupal version assumes at least two tabs start inside the view and throws otherwise.
  // Here, fall back to the last one, and when there is none, to simply showing the end.
  const target = startingInside[1] ?? startingInside[startingInside.length - 1];
  if (target) return target.left - view.left;

  const contentRight = Math.max(...tabs.map((tab) => tab.right));
  return Math.max(0, contentRight - view.right);
}

/** How far to scroll so `tab` is fully inside `view`, or 0 if it already is. Called "ensureVisible" in the Drupal version. */
export function getRevealOffset(tab: Span, view: Span): number {
  if (tab.left < view.left) return tab.left - view.left;
  if (tab.right > view.right) return tab.right - view.right;
  return 0;
}
