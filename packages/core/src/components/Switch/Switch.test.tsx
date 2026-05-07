import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('toggles with click', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="Email notifications" onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('switch', { name: 'Email notifications' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('renders as disabled when requested', () => {
    render(<Switch label="Email notifications" isDisabled />);
    expect(screen.getByRole('switch', { name: 'Email notifications' })).toBeDisabled();
  });

  it('forwards native form props like name and onBlur', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    const onChange = vi.fn();
    render(
      <Switch
        label="Email notifications"
        name="notifications"
        onBlur={onBlur}
        onChange={onChange}
      />,
    );
    const switchInput = screen.getByRole('switch', { name: 'Email notifications' });

    await user.click(switchInput);
    await user.tab();

    expect(switchInput).toHaveAttribute('name', 'notifications');
    expect(onChange).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
  });

  it('supports native checked/disabled aliases', () => {
    render(<Switch label="Email notifications" checked disabled />);
    const switchInput = screen.getByRole('switch', { name: 'Email notifications' });
    expect(switchInput).toBeChecked();
    expect(switchInput).toBeDisabled();
  });
});
