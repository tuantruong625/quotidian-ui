import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('toggles selection on click', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={onCheckedChange}>Accept</Checkbox>);

    await user.click(screen.getByRole('checkbox', { name: 'Accept' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', () => {
    render(<Checkbox isDisabled>Accept</Checkbox>);
    expect(screen.getByRole('checkbox', { name: 'Accept' })).toBeDisabled();
  });

  it('forwards native form props like name and onBlur', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    const onChange = vi.fn();
    render(
      <Checkbox name="acceptTerms" onBlur={onBlur} onChange={onChange}>
        Accept
      </Checkbox>,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Accept' });
    await user.click(checkbox);
    await user.tab();

    expect(checkbox).toHaveAttribute('name', 'acceptTerms');
    expect(onChange).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
  });

  it('supports native checked/disabled aliases', () => {
    render(
      <Checkbox checked disabled>
        Accept
      </Checkbox>,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Accept' });
    expect(checkbox).toBeChecked();
    expect(checkbox).toBeDisabled();
  });
});
