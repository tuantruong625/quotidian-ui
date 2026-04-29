import type { Meta, StoryObj } from '@storybook/react';
import { FieldWrapper } from './FieldWrapper';

const meta: Meta<typeof FieldWrapper> = {
  title: 'Components/FieldWrapper',
  component: FieldWrapper,
};

export default meta;
type Story = StoryObj<typeof FieldWrapper>;

export const Default: Story = {
  args: {
    id: 'field-wrapper-default',
    label: 'Email',
    helperText: 'We will never share your email.',
    children: <input id="field-wrapper-default" placeholder="you@example.com" />,
  },
};

export const Invalid: Story = {
  args: {
    id: 'field-wrapper-invalid',
    label: 'Email',
    isInvalid: true,
    errorMessage: 'Please provide a valid email address.',
    children: (
      <input id="field-wrapper-invalid" aria-invalid="true" placeholder="you@example.com" />
    ),
  },
};
