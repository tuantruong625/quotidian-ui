import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { ToastProvider, ToastRegion, pushToast } from './Toast';

const meta: Meta<typeof ToastRegion> = {
  title: 'Components/Toast',
  component: ToastRegion,
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ToastRegion>;

function ToastDemo() {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
      <Button
        onPress={() => pushToast({ title: 'Saved', description: 'Your changes were saved.' })}
      >
        Neutral
      </Button>
      <Button
        onPress={() =>
          pushToast({
            title: 'Success',
            description: 'The operation completed.',
            variant: 'success',
          })
        }
      >
        Success
      </Button>
      <Button
        onPress={() =>
          pushToast({ title: 'Error', description: 'Something went wrong.', variant: 'error' })
        }
      >
        Error
      </Button>
      <ToastRegion aria-label="Notifications" />
    </div>
  );
}

export const Default: Story = {
  render: ToastDemo,
};
