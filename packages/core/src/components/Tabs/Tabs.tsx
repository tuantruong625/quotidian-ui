import { createContext, forwardRef, useContext, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Key, Node } from 'react-stately';
import { Item, useTabListState } from 'react-stately';
import type { TabListState } from 'react-stately';
import { useTab, useTabList, useTabPanel } from 'react-aria';
import type { AriaTabListProps } from 'react-aria';
import { cn } from '../../utils/cn';
import styles from './Tabs.module.css';

export type TabDefinition = {
  key: string;
  label: ReactNode;
  children: ReactNode;
  isDisabled?: boolean;
};

function textValueFromLabel(label: ReactNode, fallbackKey: string): string {
  if (typeof label === 'string') {
    return label;
  }
  if (typeof label === 'number') {
    return String(label);
  }
  return fallbackKey;
}

type TabsContextValue = {
  state: TabListState<object>;
  panelByKey: Map<string, ReactNode>;
  orientation: NonNullable<TabsProps['orientation']>;
  keyboardActivation: NonNullable<TabsProps['keyboardActivation']>;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error('Tabs components must be used within <Tabs>');
  }
  return ctx;
}

export type TabsProps = {
  items: TabDefinition[];
  children: ReactNode;
  className?: string;
  defaultSelectedKey?: Key;
  selectedKey?: Key;
  onSelectionChange?: (key: Key) => void;
  disabledKeys?: Iterable<Key>;
  isDisabled?: boolean;
} & Pick<AriaTabListProps<object>, 'orientation' | 'keyboardActivation'>;

export function Tabs({
  items,
  children,
  className,
  defaultSelectedKey,
  selectedKey,
  onSelectionChange,
  disabledKeys,
  isDisabled,
  orientation = 'horizontal',
  keyboardActivation = 'automatic',
}: TabsProps) {
  const disabledKeysFromItems = useMemo(
    () => items.filter((tab) => tab.isDisabled).map((tab) => tab.key),
    [items],
  );

  const mergedDisabledKeys = useMemo(() => {
    const fromProps = disabledKeys ? [...disabledKeys] : [];
    const combined = new Set([...fromProps, ...disabledKeysFromItems]);
    return [...combined];
  }, [disabledKeys, disabledKeysFromItems]);

  const collectionChildren = useMemo(
    () =>
      items.map((tab) => (
        <Item key={tab.key} textValue={textValueFromLabel(tab.label, tab.key)}>
          {tab.label}
        </Item>
      )),
    [items],
  );

  const state = useTabListState({
    children: collectionChildren,
    defaultSelectedKey,
    selectedKey,
    onSelectionChange,
    disabledKeys: mergedDisabledKeys,
    isDisabled,
  });

  const panelByKey = useMemo(() => new Map(items.map((tab) => [tab.key, tab.children])), [items]);

  const value = useMemo(
    () => ({
      state,
      panelByKey,
      orientation,
      keyboardActivation,
    }),
    [state, panelByKey, orientation, keyboardActivation],
  );

  return (
    <TabsContext.Provider value={value}>
      <div
        className={cn(styles.root, className)}
        data-orientation={orientation}
        data-keyboard-activation={keyboardActivation}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

Tabs.displayName = 'Tabs';

export type TabListProps = Pick<AriaTabListProps<object>, 'aria-label' | 'aria-labelledby' | 'id'> &
  Pick<TabsProps, 'orientation' | 'keyboardActivation'> & {
    className?: string;
  };

export const TabList = forwardRef<HTMLDivElement, TabListProps>(function TabList(
  {
    className,
    orientation: orientationProp,
    keyboardActivation: keyboardActivationProp,
    ...ariaProps
  },
  forwardedRef,
) {
  const {
    state,
    orientation: ctxOrientation,
    keyboardActivation: ctxKeyboardActivation,
  } = useTabsContext();
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = (forwardedRef || internalRef) as React.RefObject<HTMLDivElement>;
  const orientation = orientationProp ?? ctxOrientation;
  const keyboardActivation = keyboardActivationProp ?? ctxKeyboardActivation;
  const { tabListProps } = useTabList(
    {
      ...ariaProps,
      orientation,
      keyboardActivation,
    },
    state,
    ref,
  );

  return (
    <div {...tabListProps} ref={ref} className={cn(styles.tabList, className)}>
      {[...state.collection].map((item) => (
        <Tab key={item.key} item={item} />
      ))}
    </div>
  );
});

TabList.displayName = 'TabList';

export type TabComponentProps = {
  item: Node<object>;
  className?: string;
};

export const Tab = forwardRef<HTMLButtonElement, TabComponentProps>(function Tab(
  { item, className },
  forwardedRef,
) {
  const { state } = useTabsContext();
  const internalRef = useRef<HTMLButtonElement>(null);
  const ref = (forwardedRef || internalRef) as React.RefObject<HTMLButtonElement>;
  const { tabProps } = useTab({ key: item.key }, state, ref);

  return (
    <button type="button" {...tabProps} ref={ref} className={cn(styles.tab, className)}>
      {item.rendered}
    </button>
  );
});

Tab.displayName = 'Tab';

export type TabPanelProps = {
  className?: string;
  emptyContent?: ReactNode;
};

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(
  { className, emptyContent = null },
  forwardedRef,
) {
  const { state, panelByKey } = useTabsContext();
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = (forwardedRef || internalRef) as React.RefObject<HTMLDivElement>;
  const selectedKey = state.selectedKey != null ? String(state.selectedKey) : null;
  const { tabPanelProps } = useTabPanel({}, state, ref);
  const panelContent =
    selectedKey != null ? (panelByKey.get(selectedKey) ?? emptyContent) : emptyContent;

  return (
    <div {...tabPanelProps} ref={ref} className={cn(styles.tabPanel, className)}>
      {panelContent}
    </div>
  );
});

TabPanel.displayName = 'TabPanel';
