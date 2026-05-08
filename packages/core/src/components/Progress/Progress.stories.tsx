import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './Progress';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Determinate: Story = {
  args: {
    label: 'Uploading',
    value: 45,
    minValue: 0,
    maxValue: 100,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Working',
    isIndeterminate: true,
  },
};
