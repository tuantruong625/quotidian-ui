import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider } from 'react-aria';
import { NumberField } from './NumberField';

function renderNumberField(ui: ReactElement) {
  return render(<I18nProvider locale="en-US">{ui}</I18nProvider>);
}

describe('NumberField', () => {
  it('associates label with the input', () => {
    renderNumberField(<NumberField id="qty" label="Quantity" defaultValue={3} />);
    expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
  });

  it('increments via the increment button', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderNumberField(
      <NumberField
        label="Count"
        defaultValue={1}
        step={1}
        minValue={0}
        maxValue={5}
        onChange={onChange}
      />,
    );

    const increment = screen.getByRole('button', { name: /increase/i });
    await user.click(increment);
    expect(onChange).toHaveBeenCalled();
  });
});
