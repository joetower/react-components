import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
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
