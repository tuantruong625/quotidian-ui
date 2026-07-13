import type { Meta, StoryObj } from '@storybook/react';
import { NumberField } from './NumberField';

const meta: Meta<typeof NumberField> = {
  title: 'Components/NumberField',
  component: NumberField,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NumberField>;

export const Default: Story = {
  args: {
    label: 'Quantity',
    defaultValue: 2,
    minValue: 0,
    maxValue: 10,
    step: 1,
    helperText: 'Use the steppers or type a value.',
  },
};

export const Currency: Story = {
  args: {
    label: 'Price',
    defaultValue: 19.99,
    currency: 'USD',
    minValue: 0,
    formatOptions: { minimumFractionDigits: 2 },
    helperText: 'Currency uses `currency` + `formatOptions` with React Aria number formatting.',
  },
};

export const NoStepper: Story = {
  args: {
    label: 'Score',
    defaultValue: 0,
    hideStepper: true,
    minValue: 0,
    maxValue: 100,
  },
};
