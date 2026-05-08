import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    label: 'Volume',
    defaultValue: 30,
    minValue: 0,
    maxValue: 100,
  },
};

function SliderControlledStory() {
  const [value, setValue] = useState(40);
  return (
    <Slider label="Brightness" value={value} onChange={setValue} minValue={0} maxValue={100} />
  );
}

export const Controlled: Story = {
  render: SliderControlledStory,
};
