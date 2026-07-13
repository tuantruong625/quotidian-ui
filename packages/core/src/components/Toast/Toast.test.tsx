import { act, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ToastQueue } from 'react-stately';
import { ToastProvider, ToastRegion } from './Toast';
import type { ToastContent } from './Toast';

describe('Toast', () => {
  it('shows a queued toast and dismisses it on close', async () => {
    const user = userEvent.setup();
    const queue = new ToastQueue<ToastContent>({ maxVisibleToasts: 5 });
    render(
      <ToastProvider queue={queue}>
        <ToastRegion aria-label="Notifications" />
      </ToastProvider>,
    );

    act(() => {
      queue.add({ title: 'Saved', description: 'Your changes were saved.' });
    });

    expect(await screen.findByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Your changes were saved.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    // Stays mounted with an exiting flag while the exit animation plays...
    expect(screen.getByText('Saved').closest('[data-exiting]')).not.toBeNull();
    // ...then unmounts once the animation finishes.
    await waitForElementToBeRemoved(() => screen.queryByText('Saved'));
  });
});
