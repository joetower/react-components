import { useId, useMemo, useRef } from 'react';
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

function TabList({ children, ...aria }: TabListProps) {
  const { select, activation, orientation } = useTabsContext('Tabs.List');
  const listRef = useRef<HTMLDivElement>(null);

  // WAI-ARIA tabs pattern: arrows move focus between tabs, Home/End jump to the ends.
  // Enter and Space already work because each tab is a real <button>.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? []);
    const current = tabs.indexOf((event.target as HTMLElement).closest<HTMLButtonElement>('[role="tab"]') as HTMLButtonElement);
    if (current === -1) return;

    const previousKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';

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

  return (
    <div
      ref={listRef}
      className="tabs__list"
      role="tablist"
      aria-orientation={orientation}
      onKeyDown={handleKeyDown}
      {...aria}
    >
      {children}
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
