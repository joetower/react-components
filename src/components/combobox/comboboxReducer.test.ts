import { describe, expect, it } from 'vitest';
import { comboboxReducer, createInitialState, getNextEnabledIndex, normalizeText } from './comboboxReducer';
import type { ComboboxState } from './comboboxReducer';

const initial = createInitialState<{ value: string }>('', false);

describe('comboboxReducer', () => {
  it('typing opens the list, sets the filter, and clears the highlight', () => {
    const before: ComboboxState<{ value: string }> = { ...initial, activeIndex: 2 };
    const after = comboboxReducer(before, { type: 'input', value: 'ca' });

    expect(after).toMatchObject({ inputValue: 'ca', query: 'ca', isOpen: true, activeIndex: -1 });
  });

  it('opening twice returns the same state object, so React skips the render', () => {
    const open = comboboxReducer(initial, { type: 'open' });

    expect(open.isOpen).toBe(true);
    expect(comboboxReducer(open, { type: 'open' })).toBe(open);
  });

  it('closing resets the highlight', () => {
    const open = { ...initial, isOpen: true, activeIndex: 3 };

    expect(comboboxReducer(open, { type: 'close' })).toMatchObject({ isOpen: false, activeIndex: -1 });
  });

  it('selecting shows the label, clears the filter, and closes', () => {
    const typing = comboboxReducer(initial, { type: 'input', value: 'ug' });
    const after = comboboxReducer(typing, { type: 'select', label: 'Uganda' });

    expect(after).toMatchObject({ inputValue: 'Uganda', query: '', isOpen: false, activeIndex: -1 });
  });

  it('reset restores the selected label after the user typed something else', () => {
    const typing = comboboxReducer(initial, { type: 'input', value: 'xyz' });
    const after = comboboxReducer(typing, { type: 'reset', label: 'Uganda' });

    expect(after).toMatchObject({ inputValue: 'Uganda', query: '', isOpen: false });
  });

  it('clear empties the input and filter but leaves the list open or closed as it was', () => {
    const open = { ...initial, isOpen: true, inputValue: 'abc', query: 'abc', activeIndex: 1 };

    expect(comboboxReducer(open, { type: 'clear' })).toMatchObject({
      inputValue: '',
      query: '',
      isOpen: true,
      activeIndex: -1,
    });
  });

  it('new results reset the highlight, because the old index may point at something else', () => {
    const loading = { ...initial, status: 'loading' as const, activeIndex: 2 };
    const after = comboboxReducer(loading, { type: 'loadSuccess', options: [{ value: 'a' }] });

    expect(after).toMatchObject({ status: 'idle', activeIndex: -1, loadedOptions: [{ value: 'a' }] });
  });

  it('an error clears the stale results', () => {
    const loaded = { ...initial, loadedOptions: [{ value: 'a' }] };

    expect(comboboxReducer(loaded, { type: 'loadError' })).toMatchObject({ status: 'error', loadedOptions: [] });
  });

  it('async mode starts in loading, so the first open never flashes "no results"', () => {
    expect(createInitialState('', true).status).toBe('loading');
    expect(createInitialState('', false).status).toBe('idle');
  });
});

describe('getNextEnabledIndex', () => {
  const options = [{ disabled: false }, { disabled: true }, { disabled: false }, { disabled: false }];

  it('moves forward and skips disabled options', () => {
    expect(getNextEnabledIndex(options, 0, 1)).toBe(2);
  });

  it('wraps from the end to the start', () => {
    expect(getNextEnabledIndex(options, 3, 1)).toBe(0);
  });

  it('wraps from the start to the end when moving backwards', () => {
    expect(getNextEnabledIndex(options, 0, -1)).toBe(3);
  });

  it('starting from nothing highlighted, forward lands on the first and backward on the last', () => {
    expect(getNextEnabledIndex(options, -1, 1)).toBe(0);
    expect(getNextEnabledIndex(options, -1, -1)).toBe(3);
  });

  it('returns -1 when there are no options, or none are enabled', () => {
    expect(getNextEnabledIndex([], -1, 1)).toBe(-1);
    expect(getNextEnabledIndex([{ disabled: true }, { disabled: true }], -1, 1)).toBe(-1);
  });
});

describe('normalizeText', () => {
  it('ignores case and accents', () => {
    expect(normalizeText('Zürich')).toBe('zurich');
    expect(normalizeText('SÃO PAULO')).toBe('sao paulo');
  });
});
