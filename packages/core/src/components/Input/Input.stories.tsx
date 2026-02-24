import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
	title: 'Components/Input',
	component: Input,
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
		size: 'md',
		placeholder: 'Placeholder',
		label: 'Text Input',
	},
};
