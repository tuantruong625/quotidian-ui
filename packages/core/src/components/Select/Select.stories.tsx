import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;

const options = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
  { label: 'Enterprise', value: 'enterprise' },
];

export const Default: Story = {
  args: {
    id: 'plan',
    label: 'Plan',
    options,
    helperText: 'Choose a billing tier',
  },
};

export const Invalid: Story = {
  args: {
    ...Default.args,
    isInvalid: true,
    errorMessage: 'Please choose a plan',
  },
};
