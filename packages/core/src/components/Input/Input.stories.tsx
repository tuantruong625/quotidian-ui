import type { Meta, StoryObj } from '@storybook/react';
import { Search, Sparkles } from 'lucide-react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          'Plain text via `useTextField`. For numbers, currency, or spinbutton semantics, use **NumberField** (`useNumberField`) instead of `type="number"`.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    id: 'input-default',
    size: 'md',
    placeholder: 'Placeholder',
    label: 'Text Input',
    startIcon: <Search size={16} aria-hidden="true" />,
    endIcon: <Sparkles size={16} aria-hidden="true" />,
    isLoading: false,
    helperText: 'This is a text input',
    errorMessage: 'This field is required',
    isRequired: true,
    type: 'text',
    value: '',
    onChange: () => ({}),
    defaultValue: '',
    isDisabled: false,
  },
};

export const Invalid: Story = {
  args: {
    ...Default.args,
    id: 'input-invalid',
    isInvalid: true,
    value: 'bad email',
    label: 'Email',
    type: 'email',
  },
};
