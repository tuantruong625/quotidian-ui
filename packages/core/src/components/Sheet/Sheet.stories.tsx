import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button';
import { Sheet } from './Sheet';

const meta: Meta<typeof Sheet> = {
  title: 'Components/Sheet',
  component: Sheet,
};

export default meta;
type Story = StoryObj<typeof Sheet>;

function SheetRightStory() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Open sheet</Button>
      <Sheet isOpen={open} onOpenChange={setOpen} title="Details" side="right">
        <p style={{ margin: 0 }}>Sheet content.</p>
      </Sheet>
    </>
  );
}

export const Right: Story = {
  render: SheetRightStory,
};
