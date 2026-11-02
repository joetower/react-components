import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import Tabs from './Tabs';
import Button from '../button/Button';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    defaultValue: 'overview',
    orientation: 'horizontal',
    activation: 'automatic',
    theme: 'primary',
    width: 'components',
    onValueChange: fn(),
    children: null,
  },
  argTypes: {
    orientation: {
      name: 'Orientation',
      options: ['horizontal', 'vertical'],
      control: { type: 'inline-radio' },
      table: { category: 'Options' },
    },
    activation: {
      name: 'Activation',
      description: 'Automatic selects a tab as soon as arrow keys focus it. Manual waits for Enter or Space.',
      options: ['automatic', 'manual'],
      control: { type: 'inline-radio' },
      table: { category: 'Options' },
    },
    theme: {
      name: 'Theme',
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'select' },
      table: { category: 'Options' },
    },
    width: {
      name: 'Width',
      options: ['components', 'inner', 'wide', 'full'],
      control: { type: 'select' },
      table: { category: 'Options' },
    },
    defaultValue: {
      name: 'Initially selected tab (uncontrolled)',
      control: 'text',
      table: { category: 'State' },
    },
  },
  parameters: {
    // Content is composed in JSX, and controlled state belongs to the parent
    controls: { exclude: ['children', 'value', 'onValueChange', 'baseClass'] },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The shared markup for most stories, so each story only shows what's different about it. */
const sampleTabs = (props: { disabledValue?: string } = {}) => (
  <>
    <Tabs.List aria-label="Trip sections">
      <Tabs.Tab value="overview">Overview</Tabs.Tab>
      <Tabs.Tab value="itinerary" disabled={props.disabledValue === 'itinerary'}>
        Itinerary
      </Tabs.Tab>
      <Tabs.Tab value="gear">Gear</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="overview">
      <p>Tabs share their selected value through Context, so the list and panels never pass it to each other.</p>
    </Tabs.Panel>
    <Tabs.Panel value="itinerary">
      <p>Each panel stays mounted but hidden, so state inside a panel survives switching tabs.</p>
      <input aria-label="Notes" defaultValue="Type here, switch tabs, and come back" style={{ width: '100%' }} />
    </Tabs.Panel>
    <Tabs.Panel value="gear">
      <p>Only the selected tab is in the Tab order. Arrow keys move between the rest.</p>
    </Tabs.Panel>
  </>
);

/** Automatic activation: arrow keys both move focus and select. */
export const Default: Story = {
  render: (args) => <Tabs {...args}>{sampleTabs()}</Tabs>,
};

/** Manual activation: arrow keys only move focus. Enter or Space selects. */
export const ManualActivation: Story = {
  args: { activation: 'manual' },
  render: (args) => <Tabs {...args}>{sampleTabs()}</Tabs>,
};

/** Vertical tabs swap the arrow keys to Up and Down. */
export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => <Tabs {...args}>{sampleTabs()}</Tabs>,
};

/** Disabled tabs can't be selected and are skipped by arrow-key navigation. */
export const WithDisabledTab: Story = {
  render: (args) => <Tabs {...args}>{sampleTabs({ disabledValue: 'itinerary' })}</Tabs>,
};

/** The parent owns the selection, so buttons outside the component can change it. */
function ControlledExample(props: Pick<React.ComponentProps<typeof Tabs>, 'theme' | 'orientation' | 'activation' | 'width'>) {
  const [value, setValue] = useState('overview');

  return (
    <>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBlockEnd: '1rem' }}>
        <Button type="button" theme={props.theme} size="small" label="Go to Gear" onClick={() => setValue('gear')} />
        <Button type="button" theme={props.theme} size="small" label="Back to Overview" onClick={() => setValue('overview')} />
      </div>
      <Tabs {...props} value={value} onValueChange={setValue}>
        {sampleTabs()}
      </Tabs>
      <p>
        Selected: <output>{value}</output>
      </p>
    </>
  );
}

export const Controlled: Story = {
  render: ({ theme, orientation, activation, width }) => (
    <ControlledExample theme={theme} orientation={orientation} activation={activation} width={width} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Go to Gear' }));
    await expect(canvas.getByRole('tab', { name: 'Gear' })).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('status')).toHaveTextContent('gear');

    // Clicking a tab reports the change upward, and the parent's state follows
    await userEvent.click(canvas.getByRole('tab', { name: 'Itinerary' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('itinerary');
  },
};

export const ClickSelectsTab: Story = {
  render: (args) => <Tabs {...args}>{sampleTabs()}</Tabs>,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const overview = canvas.getByRole('tab', { name: 'Overview' });
    const gear = canvas.getByRole('tab', { name: 'Gear' });

    await expect(overview).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveAccessibleName('Overview');

    await userEvent.click(gear);
    await expect(gear).toHaveAttribute('aria-selected', 'true');
    await expect(overview).toHaveAttribute('aria-selected', 'false');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('gear');

    // Only one panel is exposed at a time, and it's labelled by the selected tab
    await expect(canvas.getAllByRole('tabpanel')).toHaveLength(1);
    await expect(canvas.getByRole('tabpanel')).toHaveAccessibleName('Gear');
  },
};

export const KeyboardAutomatic: Story = {
  render: (args) => <Tabs {...args}>{sampleTabs()}</Tabs>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [overview, itinerary, gear] = canvas.getAllByRole('tab');

    // Roving tabindex: only the selected tab is a Tab stop
    await expect(overview).toHaveAttribute('tabindex', '0');
    await expect(itinerary).toHaveAttribute('tabindex', '-1');

    await userEvent.tab();
    await expect(overview).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(itinerary).toHaveFocus();
    await expect(itinerary).toHaveAttribute('aria-selected', 'true');

    await userEvent.keyboard('{End}');
    await expect(gear).toHaveFocus();
    await expect(gear).toHaveAttribute('aria-selected', 'true');

    // Wraps around
    await userEvent.keyboard('{ArrowRight}');
    await expect(overview).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    await expect(gear).toHaveFocus();

    await userEvent.keyboard('{Home}');
    await expect(overview).toHaveFocus();
    await expect(overview).toHaveAttribute('aria-selected', 'true');
  },
};

export const KeyboardManual: Story = {
  args: { activation: 'manual' },
  render: (args) => <Tabs {...args}>{sampleTabs()}</Tabs>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [overview, itinerary] = canvas.getAllByRole('tab');

    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');

    // Focus moved, but nothing was selected yet
    await expect(itinerary).toHaveFocus();
    await expect(itinerary).toHaveAttribute('aria-selected', 'false');
    await expect(overview).toHaveAttribute('aria-selected', 'true');

    await userEvent.keyboard('{Enter}');
    await expect(itinerary).toHaveAttribute('aria-selected', 'true');
    await expect(overview).toHaveAttribute('aria-selected', 'false');
  },
};

export const KeyboardVertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => <Tabs {...args}>{sampleTabs()}</Tabs>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [, itinerary] = canvas.getAllByRole('tab');

    await expect(canvas.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');

    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');
    await expect(itinerary).toHaveFocus();
  },
};

export const DisabledTabIsSkipped: Story = {
  render: (args) => <Tabs {...args}>{sampleTabs({ disabledValue: 'itinerary' })}</Tabs>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [overview, , gear] = canvas.getAllByRole('tab');

    await userEvent.tab();
    await expect(overview).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(gear).toHaveFocus();
  },
};

const manyTabs = Array.from({ length: 12 }, (_, index) => ({
  value: `tab-${index + 1}`,
  label: `Destination ${index + 1}`,
}));

/** A narrow container, so the tabs have to overflow. */
const narrowContainer: NonNullable<Story['decorators']> = [
  (StoryComponent) => (
    <div style={{ maxWidth: '28rem' }}>
      <StoryComponent />
    </div>
  ),
];

const overflowingTabs = (
  <>
    <Tabs.List aria-label="Destinations">
      {manyTabs.map((tab) => (
        <Tabs.Tab key={tab.value} value={tab.value}>
          {tab.label}
        </Tabs.Tab>
      ))}
    </Tabs.List>
    {manyTabs.map((tab) => (
      <Tabs.Panel key={tab.value} value={tab.value}>
        <p>Content for {tab.label}.</p>
      </Tabs.Panel>
    ))}
  </>
);

/** The arrows only exist while the tabs don't fit, so wait for them to appear. */
const findScrollArrows = async (canvasElement: HTMLElement) => {
  await waitFor(() => expect(canvasElement.querySelector('.tabs__scroll--end')).not.toBeNull());
  return {
    start: canvasElement.querySelector<HTMLButtonElement>('.tabs__scroll--start')!,
    end: canvasElement.querySelector<HTMLButtonElement>('.tabs__scroll--end')!,
  };
};

const getTabWidth = (tab: HTMLElement) => tab.getBoundingClientRect().width;

/** True when the tab is fully inside the visible part of the list (1px of rounding allowed). */
const isFullyVisible = (list: HTMLElement, tab: HTMLElement) => {
  const listRect = list.getBoundingClientRect();
  const tabRect = tab.getBoundingClientRect();
  return tabRect.left >= listRect.left - 1 && tabRect.right <= listRect.right + 1;
};

/**
 * When the tabs don't fit, they scroll sideways instead of wrapping. Arrows appear beside the
 * tabs (never on top of them). The arrow for a direction with nothing left to reveal is dimmed.
 * The arrows are for mouse and touch: keyboard users already have the arrow keys.
 */
export const OverflowingTabs: Story = {
  args: { defaultValue: 'tab-1', width: 'full' },
  decorators: narrowContainer,
  render: (args) => <Tabs {...args}>{overflowingTabs}</Tabs>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('tablist');
    const { start, end } = await findScrollArrows(canvasElement);

    // Tabs stay on one line and overflow
    await expect(list.scrollWidth).toBeGreaterThan(list.clientWidth);

    // At the start there is nothing to the left, so only the end arrow is usable
    await expect(start).toBeDisabled();
    await expect(end).toBeEnabled();

    // The arrows are mouse and touch only, so they stay out of the accessibility tree and Tab order
    await expect(end).toHaveAttribute('aria-hidden', 'true');
    await expect(end).toHaveAttribute('tabindex', '-1');

    await userEvent.click(end);
    await waitFor(() => expect(list.scrollLeft).toBeGreaterThan(0));
    await waitFor(() => expect(start).toBeEnabled());

    // Using the arrow didn't change which tab is selected
    await expect(canvas.getByRole('tab', { name: 'Destination 1' })).toHaveAttribute('aria-selected', 'true');
  },
};

/** Tabs that fit need no arrows at all. */
export const TabsThatFitHaveNoArrows: Story = {
  render: (args) => <Tabs {...args}>{sampleTabs()}</Tabs>,
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('.tabs__scroll')).toHaveLength(0);
  },
};

/** The selected tab starts off-screen, so the list scrolls to reveal it. */
export const SelectedTabScrollsIntoView: Story = {
  args: { defaultValue: 'tab-12', width: 'full' },
  decorators: narrowContainer,
  render: (args) => <Tabs {...args}>{overflowingTabs}</Tabs>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('tablist');
    const { start, end } = await findScrollArrows(canvasElement);

    await waitFor(() => expect(list.scrollLeft).toBeGreaterThan(0));
    await waitFor(() => expect(start).toBeEnabled());
    await waitFor(() => expect(end).toBeDisabled());

    await expect(isFullyVisible(list, canvas.getByRole('tab', { name: 'Destination 12' }))).toBe(true);
  },
};

/** Keyboard navigation scrolls the focused tab into view and updates the arrows. */
export const KeyboardScrollsOverflowingTabs: Story = {
  args: { defaultValue: 'tab-1', width: 'full' },
  decorators: narrowContainer,
  render: (args) => <Tabs {...args}>{overflowingTabs}</Tabs>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('tablist');
    const { start, end } = await findScrollArrows(canvasElement);

    await userEvent.tab();
    await userEvent.keyboard('{End}');

    await expect(canvas.getByRole('tab', { name: 'Destination 12' })).toHaveFocus();
    await waitFor(() => expect(list.scrollLeft).toBeGreaterThan(0));
    await waitFor(() => expect(start).toBeEnabled());
    await waitFor(() => expect(end).toBeDisabled());

    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(end).toBeEnabled());
    await waitFor(() => expect(start).toBeDisabled());
  },
};

/**
 * With manual activation, arrow keys move focus without changing the selection. The list must
 * still scroll to show the focused tab, or keyboard users would be focused on a tab they can't see.
 */
export const ManualActivationRevealsFocusedTab: Story = {
  args: { defaultValue: 'tab-1', activation: 'manual', width: 'full' },
  decorators: narrowContainer,
  render: (args) => <Tabs {...args}>{overflowingTabs}</Tabs>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('tablist');
    await findScrollArrows(canvasElement);

    await userEvent.tab();
    await userEvent.keyboard('{End}');

    const last = canvas.getByRole('tab', { name: 'Destination 12' });
    await expect(last).toHaveFocus();
    // Focus moved, the selection did not
    await expect(canvas.getByRole('tab', { name: 'Destination 1' })).toHaveAttribute('aria-selected', 'true');
    await waitFor(() => expect(isFullyVisible(list, last)).toBe(true));
  },
};

/**
 * Regression test for scroll whitespace. Reported: after scrolling to the last tab and
 * making it active, there was extra room after it; scrolling back left a large scrollable
 * gap before the first tab. The tabs must meet the edges of the list exactly, and the list
 * must not be scrollable beyond its tabs.
 */
export const NoWhitespaceAtEitherEnd: Story = {
  args: { defaultValue: 'tab-1', width: 'full' },
  decorators: narrowContainer,
  render: (args) => <Tabs {...args}>{overflowingTabs}</Tabs>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('tablist');
    const { start, end } = await findScrollArrows(canvasElement);
    const tabs = canvas.getAllByRole('tab');
    const first = tabs[0];
    const last = tabs[tabs.length - 1];

    // The list's scrollable width is exactly its tabs. There's no padding or leftover space.
    const tabsWidth = tabs.reduce((total, tab) => total + getTabWidth(tab), 0);
    await expect(Math.abs(list.scrollWidth - tabsWidth)).toBeLessThan(2);

    // At the start, the first tab meets the left edge
    await expect(Math.abs(first.getBoundingClientRect().left - list.getBoundingClientRect().left)).toBeLessThan(1);

    // Click the end arrow until there's nothing left to reveal, the way a user would,
    // then make the last tab active by clicking it
    const widthBefore = getTabWidth(last);
    for (let attempts = 0; attempts < 20 && !end.disabled; attempts++) {
      await userEvent.click(end);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    await waitFor(() => expect(end).toBeDisabled(), { timeout: 3000 });
    await userEvent.click(last);
    await waitFor(() => expect(last).toHaveAttribute('aria-selected', 'true'));

    // Becoming active (bold) must not resize the tab, or everything after it shifts
    await expect(Math.abs(getTabWidth(last) - widthBefore)).toBeLessThan(0.5);

    // At the end, the last tab meets the right edge, with no gap after it, and the list can't scroll further
    await waitFor(() =>
      expect(Math.abs(last.getBoundingClientRect().right - list.getBoundingClientRect().right)).toBeLessThan(1)
    );
    await expect(Math.abs(list.scrollLeft - (list.scrollWidth - list.clientWidth))).toBeLessThan(1);

    // Scroll all the way back. The first tab meets the left edge again, and nothing scrolls past it.
    for (let attempts = 0; attempts < 20 && !start.disabled; attempts++) {
      await userEvent.click(start);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    await waitFor(() => expect(start).toBeDisabled(), { timeout: 3000 });
    await expect(list.scrollLeft).toBe(0);
    await expect(Math.abs(first.getBoundingClientRect().left - list.getBoundingClientRect().left)).toBeLessThan(1);
  },
};

/** Selecting a tab makes its text bold. That must not change its width. */
export const SelectingATabNeverResizesIt: Story = {
  args: { defaultValue: 'tab-1', width: 'full' },
  decorators: narrowContainer,
  render: (args) => <Tabs {...args}>{overflowingTabs}</Tabs>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await findScrollArrows(canvasElement);
    const widthsBefore = canvas.getAllByRole('tab').map(getTabWidth);

    await userEvent.click(canvas.getByRole('tab', { name: 'Destination 3' }));
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Destination 3' })).toHaveAttribute('aria-selected', 'true'));

    canvas.getAllByRole('tab').forEach((tab, index) => {
      expect(Math.abs(getTabWidth(tab) - widthsBefore[index])).toBeLessThan(0.5);
    });
  },
};
