import type { Meta, StoryObj } from '@storybook/react';
import { Radio, RadioGroup } from './Radio';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup label="Plan" defaultValue="starter">
      <Radio value="starter">Starter</Radio>
      <Radio value="pro">Pro</Radio>
    </RadioGroup>
  ),
};
