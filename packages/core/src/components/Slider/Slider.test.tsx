import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Slider } from './Slider';

describe('Slider', () => {
  it('increments with ArrowRight', async () => {
    const user = userEvent.setup();
    render(<Slider label="Volume" defaultValue={10} minValue={0} maxValue={100} step={1} />);
    const slider = screen.getByRole('slider', { name: 'Volume' });
    slider.focus();
    await user.keyboard('{ArrowRight}');
    await waitFor(() => expect(slider).toHaveAttribute('aria-valuetext', '11'));
  });
});
