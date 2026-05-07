import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

const options = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
];

describe('Select', () => {
  it('renders options', () => {
    render(<Select id="plan" label="Plan" options={options} />);
    expect(screen.getByRole('combobox', { name: 'Plan' })).toBeInTheDocument();
  });

  it('calls onChange when selecting option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select id="plan" label="Plan" options={options} onChange={onChange} />);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Plan' }), 'pro');
    expect(onChange).toHaveBeenCalled();
  });

  it('forwards native form props like name and onBlur', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<Select id="plan" label="Plan" options={options} name="plan" onBlur={onBlur} />);
    const select = screen.getByRole('combobox', { name: 'Plan' });

    await user.click(select);
    await user.tab();

    expect(select).toHaveAttribute('name', 'plan');
    expect(onBlur).toHaveBeenCalled();
  });

  it('supports native disabled/required aliases', () => {
    render(<Select id="plan" label="Plan" options={options} disabled required />);
    const select = screen.getByRole('combobox', { name: 'Plan' });
    expect(select).toBeDisabled();
    expect(select).toBeRequired();
  });
});
