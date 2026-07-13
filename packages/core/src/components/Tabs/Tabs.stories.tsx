import type { Meta, StoryObj } from '@storybook/react';
import { TabList, TabPanel, Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const sampleItems = [
  {
    key: 'overview',
    label: 'Overview',
    children: <p>Overview panel content.</p>,
  },
  {
    key: 'details',
    label: 'Details',
    children: <p>Details panel content.</p>,
  },
  {
    key: 'disabled',
    label: 'Disabled',
    isDisabled: true,
    children: <p>Not reachable.</p>,
  },
];

export const Default: Story = {
  render: () => (
    <Tabs items={sampleItems} defaultSelectedKey="overview">
      <TabList aria-label="Example tabs" />
      <TabPanel />
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs items={sampleItems} defaultSelectedKey="overview" orientation="vertical">
      <TabList aria-label="Vertical tabs" />
      <TabPanel />
    </Tabs>
  ),
};
