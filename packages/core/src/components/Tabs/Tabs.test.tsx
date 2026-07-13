import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TabList, TabPanel, Tabs } from './Tabs';

const items = [
  { key: 'a', label: 'Alpha', children: <p>Content A</p> },
  { key: 'b', label: 'Bravo', children: <p>Content B</p> },
];

describe('Tabs', () => {
  it('renders tablist and shows default panel', () => {
    render(
      <Tabs items={items} defaultSelectedKey="a">
        <TabList aria-label="Test tabs" />
        <TabPanel />
      </Tabs>,
    );

    expect(screen.getByRole('tablist', { name: 'Test tabs' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Content A')).toBeInTheDocument();
  });

  it('switches panel when a tab is activated', async () => {
    const user = userEvent.setup();
    render(
      <Tabs items={items} defaultSelectedKey="a">
        <TabList aria-label="Test tabs" />
        <TabPanel />
      </Tabs>,
    );

    await user.click(screen.getByRole('tab', { name: 'Bravo' }));
    expect(screen.getByRole('tab', { name: 'Bravo' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Content B')).toBeInTheDocument();
  });

  it('calls onSelectionChange when selection changes', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <Tabs items={items} defaultSelectedKey="a" onSelectionChange={onSelectionChange}>
        <TabList aria-label="Test tabs" />
        <TabPanel />
      </Tabs>,
    );

    await user.click(screen.getByRole('tab', { name: 'Bravo' }));
    expect(onSelectionChange).toHaveBeenCalledWith('b');
  });
});
