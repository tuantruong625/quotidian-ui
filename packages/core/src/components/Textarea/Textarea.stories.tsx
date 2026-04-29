import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    id: 'bio',
    label: 'Bio',
    placeholder: 'Write your bio...',
    helperText: 'A short introduction',
  },
};

export const Invalid: Story = {
  args: {
    ...Default.args,
    isInvalid: true,
    errorMessage: 'Bio is required',
  },
};
