import { createContext, useContext } from 'react';

export interface TabsContextValue {
  /** Prefix for generated DOM ids, so several Tabs on a page never collide */
  baseId: string;
  selectedValue: string;
  select: (value: string) => void;
  /** 'automatic' selects on arrow-key focus. 'manual' waits for Enter or Space. */
  activation: 'automatic' | 'manual';
  orientation: 'horizontal' | 'vertical';
}

export const TabsContext = createContext<TabsContextValue | null>(null);

/**
 * Reads the nearest Tabs. The null check turns "forgot the parent" into an
 * immediate, readable error instead of a confusing crash somewhere later.
 */
export function useTabsContext(componentName: string): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(`<${componentName}> must be rendered inside <Tabs>.`);
  }
  return context;
}

export function getTabId(baseId: string, value: string) {
  return `${baseId}-tab-${value}`;
}

export function getPanelId(baseId: string, value: string) {
  return `${baseId}-panel-${value}`;
}
