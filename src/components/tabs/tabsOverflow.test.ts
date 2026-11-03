import { describe, expect, it } from 'vitest';
import { getRevealOffset, getScrollIndicator, getScrollOffset } from './tabsOverflow';
import type { Span } from './tabsOverflow';

/** Tabs 100px wide, side by side, with the first one's left edge at `start` */
const row = (count: number, start = 0): Span[] =>
  Array.from({ length: count }, (_, i) => ({ left: start + i * 100, right: start + (i + 1) * 100 }));

const view: Span = { left: 0, right: 250 };

describe('getScrollIndicator', () => {
  it('is none when every tab fits', () => {
    expect(getScrollIndicator(row(2), view)).toBe('none');
  });

  it('is right when tabs are hidden on the right only', () => {
    expect(getScrollIndicator(row(6), view)).toBe('right');
  });

  it('is left when scrolled to the end', () => {
    expect(getScrollIndicator(row(3, -50), view)).toBe('left');
  });

  it('is both when scrolled to the middle', () => {
    expect(getScrollIndicator(row(6, -120), view)).toBe('both');
  });

  it('ignores sub-pixel overhang', () => {
    expect(getScrollIndicator(row(3, -0.4), { left: 0, right: 299.6 })).toBe('none');
  });
});

describe('getScrollOffset', () => {
  it('right: the second tab starting inside the view becomes the first', () => {
    // Tab 0 sits flush at the left edge, so tab 1 is the first to start inside and tab 2 the second
    expect(getScrollOffset(row(6), view, 'right')).toBe(200);
  });

  it('right: counts a partly hidden first tab as outside the view', () => {
    // Tab 0 is cut off on the left; tabs 1 and 2 start inside, so tab 2 comes to the edge
    expect(getScrollOffset(row(6, -40), view, 'right')).toBe(160);
  });

  it('right: falls back to the last starting tab instead of throwing when only one starts inside', () => {
    // Tabs start at -80 and 20: only tab 1 starts inside the view
    expect(getScrollOffset(row(2, -80), { left: 0, right: 100 }, 'right')).toBe(20);
  });

  it('right: shows the end when no tab starts inside the view', () => {
    const wide: Span[] = [{ left: -300, right: 500 }];
    expect(getScrollOffset(wide, view, 'right')).toBe(250);
  });

  it('left: brings the last hidden tab flush to the left edge', () => {
    // Tabs start at -250, -150, -50, 50: the nearest one cut off on the left is the one at -50
    expect(getScrollOffset(row(6, -250), view, 'left')).toBe(-50);
  });

  it('left: does nothing when nothing is hidden on the left', () => {
    expect(getScrollOffset(row(6), view, 'left')).toBe(0);
  });
});

describe('getRevealOffset', () => {
  it('is 0 for a tab that is fully visible', () => {
    expect(getRevealOffset({ left: 50, right: 150 }, view)).toBe(0);
  });

  it('scrolls left by exactly the part cut off on the left', () => {
    expect(getRevealOffset({ left: -30, right: 70 }, view)).toBe(-30);
  });

  it('scrolls right by exactly the part cut off on the right', () => {
    expect(getRevealOffset({ left: 200, right: 300 }, view)).toBe(50);
  });
});
