import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import Accordion from './Accordion';
import type { AccordionItem, AccordionProps } from './Accordion';
import Button from '../button/Button';

const sampleItems: AccordionItem[] = [
  {
    id: 'state',
    title: 'What is state?',
    content: <p>State is data a component remembers between renders. When it changes, React renders the component again.</p>,
  },
  {
    id: 'controlled',
    title: 'Controlled vs. uncontrolled',
    content: <p>Uncontrolled components keep their own state. Controlled components let the parent own it and report changes through callbacks.</p>,
  },
  {
    id: 'a11y',
    title: 'Why use buttons for the triggers?',
    content: <p>Buttons give you focus, Enter and Space handling, and the right role for free. Only the arrow keys, Home and End need extra code.</p>,
  },
];

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  args: {
    items: sampleItems,
    headingLevel: 'h3',
    mode: 'single',
    theme: 'primary',
    animation: true,
    width: 'components',
    onOpenChange: fn(),
  },
  argTypes: {
    items: {
      name: 'Items',
      control: 'object',
      table: { category: 'Data' },
    },
    headingLevel: {
      name: 'Heading level',
      options: ['h2', 'h3', 'h4', 'h5', 'h6'],
      control: { type: 'select' },
      table: { category: 'Data' },
    },
    mode: {
      name: 'Mode',
      options: ['single', 'multiple'],
      control: { type: 'inline-radio' },
      table: { category: 'Options' },
    },
    theme: {
      name: 'Theme',
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
      control: { type: 'select' },
      table: { category: 'Options' },
    },
    animation: {
      name: 'Enable animation',
      control: 'boolean',
      table: { category: 'Options' },
    },
    width: {
      name: 'Width',
      options: ['components', 'inner', 'wide', 'full'],
      control: { type: 'select' },
      table: { category: 'Options' },
    },
    defaultOpenIds: {
      name: 'Initially open ids (uncontrolled)',
      control: 'object',
      table: { category: 'State' },
    },
  },
  parameters: {
    // These are driven by props from the parent, so a knob would fight the component
    controls: { exclude: ['openIds', 'onOpenChange', 'baseClass'] },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One panel open at a time. The component owns its own state. */
export const Default: Story = {};

/** `defaultOpenIds` seeds the initial state, and the component stays uncontrolled afterwards. */
export const InitiallyOpen: Story = {
  args: { defaultOpenIds: ['controlled'] },
};

/** Any number of panels can stay open. */
export const AllowMultiple: Story = {
  args: { mode: 'multiple', defaultOpenIds: ['state', 'a11y'] },
};

/** Disabled items can't be toggled and are skipped by arrow-key navigation. */
export const WithDisabledItem: Story = {
  args: {
    items: sampleItems.map((item) => (item.id === 'controlled' ? { ...item, disabled: true } : item)),
  },
};

export const Themes: Story = {
  render: (args) => (
    <>
      {(['primary', 'secondary', 'tertiary', 'quaternary'] as const).map((theme) => (
        <Accordion
          key={theme}
          items={args.items}
          headingLevel={args.headingLevel}
          mode={args.mode}
          animation={args.animation}
          width={args.width}
          theme={theme}
          defaultOpenIds={['state']}
        />
      ))}
    </>
  ),
};

type ControlledExampleProps = Pick<AccordionProps, 'items' | 'headingLevel' | 'theme' | 'animation' | 'width'>;

/**
 * The parent owns the open state. The Accordion only reports what the user wants
 * through `onOpenChange`, and the buttons outside the component can change the same state.
 */
function ControlledExample({ items, ...rest }: ControlledExampleProps) {
  const [openIds, setOpenIds] = useState<string[]>(['state']);

  return (
    <>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBlockEnd: '1rem' }}>
        <Button
          type="button"
          theme={rest.theme}
          size="small"
          label="Expand all"
          onClick={() => setOpenIds(items.filter((item) => !item.disabled).map((item) => item.id))}
        />
        <Button type="button" theme={rest.theme} size="small" label="Collapse all" onClick={() => setOpenIds([])} />
      </div>
      <Accordion {...rest} items={items} mode="multiple" openIds={openIds} onOpenChange={setOpenIds} />
      <p>
        Open ids: <output>{openIds.length ? openIds.join(', ') : 'none'}</output>
      </p>
    </>
  );
}

export const Controlled: Story = {
  render: (args) => (
    <ControlledExample
      items={args.items}
      headingLevel={args.headingLevel}
      theme={args.theme}
      animation={args.animation}
      width={args.width}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const output = canvas.getByRole('status');

    await expect(output).toHaveTextContent('state');

    await userEvent.click(canvas.getByRole('button', { name: 'Expand all' }));
    await expect(canvas.getByRole('button', { name: 'What is state?' })).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('button', { name: 'Why use buttons for the triggers?' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    await userEvent.click(canvas.getByRole('button', { name: 'Collapse all' }));
    await expect(output).toHaveTextContent('none');
  },
};

export const SinglePanelAtATime: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('button', { name: 'What is state?' });
    const second = canvas.getByRole('button', { name: 'Controlled vs. uncontrolled' });

    await userEvent.click(first);
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(['state']);

    // Opening another panel closes the first one
    await userEvent.click(second);
    await expect(first).toHaveAttribute('aria-expanded', 'false');
    await expect(second).toHaveAttribute('aria-expanded', 'true');

    // Clicking the open panel again collapses it, leaving none open
    await userEvent.click(second);
    await expect(second).toHaveAttribute('aria-expanded', 'false');
  },
};

export const KeyboardNavigationTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const triggers = canvas.getAllByRole('button');

    await userEvent.tab();
    await expect(triggers[0]).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await expect(triggers[1]).toHaveFocus();

    await userEvent.keyboard('{End}');
    await expect(triggers[triggers.length - 1]).toHaveFocus();

    // Wraps around at the end
    await userEvent.keyboard('{ArrowDown}');
    await expect(triggers[0]).toHaveFocus();

    await userEvent.keyboard('{ArrowUp}');
    await expect(triggers[triggers.length - 1]).toHaveFocus();

    await userEvent.keyboard('{Home}');
    await expect(triggers[0]).toHaveFocus();

    // Enter toggles the focused item
    await userEvent.keyboard('{Enter}');
    await expect(triggers[0]).toHaveAttribute('aria-expanded', 'true');
  },
};
