import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Radio, RadioGroup } from './Radio';

describe('RadioGroup', () => {
  it('selects an option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RadioGroup label="Plan" onChange={onChange}>
        <Radio value="starter">Starter</Radio>
        <Radio value="pro">Pro</Radio>
      </RadioGroup>,
    );

    await user.click(screen.getByRole('radio', { name: 'Pro' }));
    expect(onChange).toHaveBeenCalledWith('pro');
  });
});
