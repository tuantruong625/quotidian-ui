import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    shape: {
      control: 'select',
      options: ['circle', 'square'],
    },
    status: {
      control: 'select',
      options: [undefined, 'online', 'offline', 'away', 'busy'],
    },
    isDisabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=47',
    alt: 'Jane Doe',
    size: 'md',
  },
};

export const WithInitials: Story = {
  args: {
    name: 'Jane Doe',
    size: 'md',
  },
};

export const WithFallbackIcon: Story = {
  args: {
    size: 'md',
  },
};

export const WithStatus: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar name="Jane Doe" status="online" />
      <Avatar name="John Smith" status="offline" />
      <Avatar name="Alice W" status="away" />
      <Avatar name="Bob K" status="busy" />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar name="Jane Doe" size="xs" />
      <Avatar name="Jane Doe" size="sm" />
      <Avatar name="Jane Doe" size="md" />
      <Avatar name="Jane Doe" size="lg" />
      <Avatar name="Jane Doe" size="xl" />
    </div>
  ),
};

export const AllShapes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar name="Jane Doe" shape="circle" size="lg" />
      <Avatar name="Jane Doe" shape="square" size="lg" />
    </div>
  ),
};

export const Clickable: Story = {
  render: () => <Avatar as="button" name="Jane Doe" size="md" onPress={() => {}} />,
};

export const ImageError: Story = {
  args: {
    src: 'https://this-url-will-definitely-fail.example/photo.jpg',
    name: 'Jane Doe',
    size: 'md',
  },
};
