import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('toggles selection on click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange}>Accept</Checkbox>);

    await user.click(screen.getByRole('checkbox', { name: 'Accept' }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', () => {
    render(<Checkbox isDisabled>Accept</Checkbox>);
    expect(screen.getByRole('checkbox', { name: 'Accept' })).toBeDisabled();
  });
});
