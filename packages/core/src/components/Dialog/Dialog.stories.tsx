import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button';
import { Dialog } from './Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
};

export default meta;
type Story = StoryObj<typeof Dialog>;

function DialogControlledStory() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Open dialog</Button>
      <Dialog isOpen={open} onOpenChange={setOpen} title="Example">
        <p style={{ margin: 0 }}>Dialog body using Quotidian Button for close.</p>
      </Dialog>
    </>
  );
}

export const Controlled: Story = {
  render: DialogControlledStory,
};
