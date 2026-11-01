import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import Combobox from './Combobox';
import type { ComboboxOption } from './Combobox';
import Button from '../button/Button';

/** Extra fields beyond `value` and `label` are fine. `renderOption` can show them. */
interface Destination extends ComboboxOption {
  region: string;
}

const destinations: Destination[] = [
  { value: 'argentina', label: 'Argentina', region: 'South America' },
  { value: 'antarctica', label: 'Antarctica (closed for the season)', region: 'Antarctica', disabled: true },
  { value: 'cambodia', label: 'Cambodia', region: 'Asia' },
  { value: 'canada', label: 'Canada', region: 'North America' },
  { value: 'cape-verde', label: 'Cape Verde', region: 'Africa' },
  { value: 'chile', label: 'Chile', region: 'South America' },
  { value: 'iceland', label: 'Iceland', region: 'Europe' },
  { value: 'japan', label: 'Japan', region: 'Asia' },
  { value: 'kenya', label: 'Kenya', region: 'Africa' },
  { value: 'namibia', label: 'Namibia', region: 'Africa' },
  { value: 'new-zealand', label: 'New Zealand', region: 'Oceania' },
  { value: 'norway', label: 'Norway', region: 'Europe' },
  { value: 'peru', label: 'Peru', region: 'South America' },
  { value: 'sequoia', label: 'Sequoia National Park', region: 'North America' },
  { value: 'tanzania', label: 'Tanzania', region: 'Africa' },
  { value: 'uganda', label: 'Uganda', region: 'Africa' },
  { value: 'yosemite', label: 'Yosemite National Park', region: 'North America' },
  { value: 'zurich', label: 'Zürich', region: 'Europe' },
];

/**
 * A stand-in for a real API. It waits, honors cancellation the way `fetch` does,
 * and can be told to fail. Pass `signal` to a real `fetch` and cancelling works the same way.
 */
function searchDestinations(
  query: string,
  signal: AbortSignal,
  { delayMs = 400, fail = false }: { delayMs?: number; fail?: boolean } = {}
): Promise<Destination[]> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (fail) {
        reject(new Error('The server is unavailable'));
        return;
      }
      const needle = query.trim().toLowerCase();
      resolve(destinations.filter((destination) => destination.label.toLowerCase().includes(needle)));
    }, delayMs);

    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

/**
 * Storybook's args typing can't represent the Combobox's props, which are two unions
 * (local or async options, controlled or uncontrolled). This flat shape is what the
 * controls and stories use, and `ComboboxDemo` routes it to the strictly-typed component.
 */
interface ComboboxStoryArgs {
  label: string;
  placeholder?: string;
  noOptionsText?: string;
  errorText?: string;
  disabled?: boolean;
  name?: string;
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  width?: 'components' | 'inner' | 'wide' | 'full';
  renderOption?: (option: Destination, state: { active: boolean; selected: boolean }) => ReactNode;
  options?: Destination[];
  loadOptions?: (query: string, signal: AbortSignal) => Promise<Destination[]>;
  debounceMs?: number;
  defaultValue?: Destination | null;
  onValueChange?: (value: Destination | null) => void;
}

function ComboboxDemo({ options, loadOptions, debounceMs, ...rest }: ComboboxStoryArgs) {
  return loadOptions ? (
    <Combobox<Destination> {...rest} loadOptions={loadOptions} debounceMs={debounceMs} />
  ) : (
    <Combobox<Destination> {...rest} options={options ?? []} />
  );
}

const meta = {
  title: 'Components/Forms/Combobox',
  component: ComboboxDemo,
  args: {
    label: 'Destination',
    placeholder: 'Search destinations',
    options: destinations,
    theme: 'primary',
    width: 'components',
    onValueChange: fn(),
  },
  argTypes: {
    label: { name: 'Label', control: 'text', table: { category: 'Data' } },
    placeholder: { name: 'Placeholder', control: 'text', table: { category: 'Data' } },
    noOptionsText: { name: 'No results text', control: 'text', table: { category: 'Data' } },
    disabled: { name: 'Disabled', control: 'boolean', table: { category: 'Options' } },
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
  },
  parameters: {
    controls: {
      exclude: ['options', 'loadOptions', 'debounceMs', 'renderOption', 'value', 'defaultValue', 'onValueChange', 'name', 'baseClass', 'errorText'],
    },
  },
  // Leaves room under the field, so the open list isn't clipped by the story canvas
  decorators: [
    (StoryComponent) => (
      <div style={{ minBlockSize: '24rem' }}>
        <StoryComponent />
      </div>
    ),
  ],
} satisfies Meta<typeof ComboboxDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

const getInput = (canvasElement: HTMLElement) => within(canvasElement).getByRole('combobox');
const getLiveRegion = (canvasElement: HTMLElement) => canvasElement.querySelector<HTMLElement>('.combobox__status')!;

/** Local mode: filters a list you already have. Type to narrow it, or press the down arrow to browse. */
export const Default: Story = {};

/** `defaultValue` seeds the selection. Opening the list starts on the selected option. */
export const WithDefaultValue: Story = {
  args: { defaultValue: destinations.find((destination) => destination.value === 'kenya') },
  play: async ({ canvasElement }) => {
    const input = getInput(canvasElement);
    await expect(input).toHaveValue('Kenya');

    await userEvent.click(input);
    // Opening shows everything, not just matches for the text in the field
    await expect(within(canvasElement).getAllByRole('option')).toHaveLength(destinations.length);

    const kenya = within(canvasElement).getByRole('option', { name: 'Kenya' });
    await expect(kenya).toHaveAttribute('aria-selected', 'true');

    // The list opens on the selected option: it's highlighted, and scrolled into view
    await expect(input).toHaveAttribute('aria-activedescendant', kenya.id);
    await waitFor(() => {
      const list = within(canvasElement).getByRole('listbox').getBoundingClientRect();
      const option = kenya.getBoundingClientRect();
      expect(option.top).toBeGreaterThanOrEqual(list.top - 1);
      expect(option.bottom).toBeLessThanOrEqual(list.bottom + 1);
    });
  },
};

/** Options can show more than their label. The selected option's `label` is still what the input shows. */
export const CustomOptionRendering: Story = {
  args: {
    renderOption: (option, { selected }) => (
      <>
        <span>{option.label}</span>
        <small style={{ opacity: 0.7, marginInlineStart: 'auto', marginInlineEnd: selected ? '0.5rem' : 0 }}>
          {option.region}
        </small>
      </>
    ),
  },
};

export const WithDisabledOption: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(getInput(canvasElement), 'ant');

    const disabled = canvas.getByRole('option', { name: /Antarctica/ });
    await expect(disabled).toHaveAttribute('aria-disabled', 'true');

    // Clicking it does nothing
    await userEvent.click(disabled);
    await expect(getInput(canvasElement)).toHaveValue('ant');
  },
};

export const FiltersAsYouType: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = getInput(canvasElement);

    await expect(input).toHaveAttribute('aria-expanded', 'false');

    await userEvent.type(input, 'ca');
    await expect(input).toHaveAttribute('aria-expanded', 'true');

    const expected = destinations.filter((destination) => destination.label.toLowerCase().includes('ca'));
    await expect(canvas.getAllByRole('option')).toHaveLength(expected.length);
    await expect(canvas.getByRole('option', { name: 'Canada' })).toBeInTheDocument();
    await expect(canvas.queryByRole('option', { name: 'Japan' })).not.toBeInTheDocument();

    // Screen readers never see the list change, because focus stays in the input, so a live region reports it
    await expect(getLiveRegion(canvasElement)).toHaveTextContent(`${expected.length} results available`);
  },
};

export const IgnoresAccentsAndCase: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.type(getInput(canvasElement), 'ZURICH');
    await expect(within(canvasElement).getByRole('option', { name: 'Zürich' })).toBeInTheDocument();
  },
};

export const NoResults: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.type(getInput(canvasElement), 'qqq');

    await expect(within(canvasElement).queryAllByRole('option')).toHaveLength(0);
    await expect(getLiveRegion(canvasElement)).toHaveTextContent('No results found');
  },
};

export const KeyboardSelection: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = getInput(canvasElement);

    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}');

    // Focus stays in the input. aria-activedescendant points at the highlighted option instead.
    const first = canvas.getAllByRole('option')[0];
    await expect(input).toHaveFocus();
    await expect(input).toHaveAttribute('aria-activedescendant', first.id);

    // The disabled Antarctica option (second in the list) is skipped
    await userEvent.keyboard('{ArrowDown}');
    await expect(input).toHaveAttribute('aria-activedescendant', canvas.getAllByRole('option')[2].id);

    await userEvent.keyboard('{ArrowUp}');
    await expect(input).toHaveAttribute('aria-activedescendant', first.id);

    // ArrowUp from the first option wraps to the last
    await userEvent.keyboard('{ArrowUp}');
    await expect(input).toHaveAttribute('aria-activedescendant', canvas.getAllByRole('option').slice(-1)[0].id);

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');

    await expect(input).toHaveValue('Argentina');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: 'argentina' }));
  },
};

export const MouseSelection: Story = {
  play: async ({ canvasElement, args }) => {
    const input = getInput(canvasElement);
    await userEvent.type(input, 'ice');
    await userEvent.click(within(canvasElement).getByRole('option', { name: 'Iceland' }));

    await expect(input).toHaveValue('Iceland');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: 'iceland' }));
  },
};

export const EscapeBehavior: Story = {
  args: { defaultValue: destinations.find((destination) => destination.value === 'peru') },
  play: async ({ canvasElement }) => {
    const input = getInput(canvasElement);

    await userEvent.click(input);
    await expect(input).toHaveAttribute('aria-expanded', 'true');

    // First Escape closes the list and keeps the value
    await userEvent.keyboard('{Escape}');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(input).toHaveValue('Peru');

    // Second Escape clears the field
    await userEvent.keyboard('{Escape}');
    await expect(input).toHaveValue('');
  },
};

export const BlurRestoresSelection: Story = {
  args: { defaultValue: destinations.find((destination) => destination.value === 'norway') },
  play: async ({ canvasElement }) => {
    const input = getInput(canvasElement);

    await userEvent.clear(input);
    await userEvent.type(input, 'half-typed text');
    // Moving away without choosing anything puts the selected value back, instead of leaving junk text
    await userEvent.tab();

    await waitFor(() => expect(input).toHaveValue(''));
  },
};

/** Async mode: the component asks for matches, debounced, and cancels requests it no longer needs. */
export const AsyncLoading: Story = {
  args: {
    options: undefined,
    loadOptions: (query: string, signal: AbortSignal) => searchDestinations(query, signal),
    debounceMs: 200,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = getInput(canvasElement);

    await userEvent.click(input);
    await expect(getLiveRegion(canvasElement)).toHaveTextContent('Loading results.');
    await waitFor(() => expect(canvas.getAllByRole('option').length).toBeGreaterThan(5), { timeout: 3000 });

    await userEvent.type(input, 'uga');
    // While the request is pending, the old results stay visible but are marked busy
    await expect(canvas.getByRole('listbox', { hidden: true })).toHaveAttribute('aria-busy', 'true');

    await waitFor(() => expect(canvas.getAllByRole('option')).toHaveLength(1), { timeout: 3000 });
    await expect(canvas.getByRole('option', { name: 'Uganda' })).toBeInTheDocument();
    await expect(getLiveRegion(canvasElement)).toHaveTextContent('1 result available');
  },
};

/** The queries the debounce story's fake API received, in order. Inspected by its test. */
const debounceRequests: string[] = [];

/** Typing quickly sends one request, not one per keystroke. */
export const AsyncDebouncesTyping: Story = {
  render: (args) => (
    <Combobox<Destination>
      label={args.label}
      placeholder={args.placeholder}
      debounceMs={300}
      loadOptions={(query, signal) => {
        debounceRequests.push(query);
        return searchDestinations(query, signal, { delayMs: 100 });
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    debounceRequests.length = 0;

    await userEvent.type(getInput(canvasElement), 'nami', { delay: 50 });
    await waitFor(() => expect(canvas.getAllByRole('option')).toHaveLength(1), { timeout: 3000 });

    // One request when the list opened (empty query) and one for "nami", not one per letter
    await expect(debounceRequests.length).toBeLessThanOrEqual(3);
    await expect(debounceRequests[debounceRequests.length - 1]).toBe('nami');
  },
};

/** A rejected request shows an error instead of an empty list. */
export const AsyncError: Story = {
  args: {
    options: undefined,
    loadOptions: (query: string, signal: AbortSignal) => searchDestinations(query, signal, { delayMs: 100, fail: true }),
    debounceMs: 100,
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(getInput(canvasElement));

    await waitFor(() => expect(getLiveRegion(canvasElement)).toHaveTextContent('Results could not be loaded'), {
      timeout: 3000,
    });
    await expect(within(canvasElement).queryAllByRole('option')).toHaveLength(0);
  },
};

/** The parent owns the selection, so buttons outside the component can change it. */
function ControlledExample() {
  const [value, setValue] = useState<Destination | null>(null);

  return (
    <>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBlockEnd: '1rem' }}>
        <Button
          type="button"
          size="small"
          label="Pick Japan"
          onClick={() => setValue(destinations.find((destination) => destination.value === 'japan') ?? null)}
        />
        <Button type="button" size="small" label="Clear" onClick={() => setValue(null)} />
      </div>
      <Combobox<Destination> label="Destination" options={destinations} value={value} onValueChange={setValue} />
      <p>
        Selected value: <code data-testid="selected-value">{value ? value.value : 'none'}</code>
      </p>
    </>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = getInput(canvasElement);
    const readout = canvas.getByTestId('selected-value');

    await expect(readout).toHaveTextContent('none');

    // The parent changes the selection, and the input follows
    await userEvent.click(canvas.getByRole('button', { name: 'Pick Japan' }));
    await expect(input).toHaveValue('Japan');
    await expect(readout).toHaveTextContent('japan');

    // The user changes it, and the parent hears about it
    await userEvent.clear(input);
    await expect(readout).toHaveTextContent('none');

    await userEvent.type(input, 'chi');
    await userEvent.click(canvas.getByRole('option', { name: 'Chile' }));
    await expect(readout).toHaveTextContent('chile');

    await userEvent.click(canvas.getByRole('button', { name: 'Clear' }));
    await expect(input).toHaveValue('');
  },
};

/** With `name`, a hidden input submits the selected `value` with the surrounding form. */
export const InsideAForm: Story = {
  args: { name: 'destination' },
  render: (args) => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        event.currentTarget.dataset.submitted = String(data.get('destination'));
      }}
    >
      <ComboboxDemo {...args} />
      <Button type="button" size="small" label="Submit (see test)" />
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const form = canvasElement.querySelector('form')!;
    const input = getInput(canvasElement);

    await userEvent.type(input, 'tanz');
    await userEvent.keyboard('{ArrowDown}');
    // Enter chooses the option. It must not submit the form while the list is open.
    await userEvent.keyboard('{Enter}');
    await expect(form.dataset.submitted).toBeUndefined();
    await expect(input).toHaveValue('Tanzania');

    const hidden = canvasElement.querySelector<HTMLInputElement>('input[type="hidden"][name="destination"]')!;
    await expect(hidden.value).toBe('tanzania');
    await expect(canvas.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
  },
};
