import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Sheet } from './Sheet';

describe('Sheet', () => {
  it('closes when Close button is pressed', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Sheet isOpen onOpenChange={onOpenChange} title="S">
        Body
      </Sheet>,
    );
    await user.click(screen.getByRole('button', { name: 'Close sheet' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
