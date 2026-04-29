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
});
