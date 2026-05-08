import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const TextLine: Story = {
  args: {
    width: '100%',
    height: '1rem',
    shape: 'line',
  },
};

export const Avatar: Story = {
  args: {
    width: '3rem',
    height: '3rem',
    shape: 'circle',
  },
};
