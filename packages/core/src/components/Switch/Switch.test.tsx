import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('toggles with click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Email notifications" onChange={onChange} />);
    await user.click(screen.getByRole('switch', { name: 'Email notifications' }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('renders as disabled when requested', () => {
    render(<Switch label="Email notifications" isDisabled />);
    expect(screen.getByRole('switch', { name: 'Email notifications' })).toBeDisabled();
  });
});
