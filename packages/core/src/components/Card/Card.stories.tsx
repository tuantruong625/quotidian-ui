import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardBody, CardFooter } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'filled'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    isInteractive: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    variant: 'elevated',
    padding: 'md',
    children: 'A simple card with default settings.',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <Card variant="elevated" padding="md" style={{ width: 200 }}>
        <CardBody>Elevated</CardBody>
      </Card>
      <Card variant="outlined" padding="md" style={{ width: 200 }}>
        <CardBody>Outlined</CardBody>
      </Card>
      <Card variant="filled" padding="md" style={{ width: 200 }}>
        <CardBody>Filled</CardBody>
      </Card>
    </div>
  ),
};

export const AllPaddings: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      {(['none', 'sm', 'md', 'lg'] as const).map((padding) => (
        <Card key={padding} variant="outlined" padding={padding} style={{ width: 140 }}>
          <CardBody>padding: {padding}</CardBody>
        </Card>
      ))}
    </div>
  ),
};

export const WithSubcomponents: Story = {
  render: () => (
    <Card variant="elevated" padding="md" style={{ width: 320 }}>
      <CardHeader>
        <strong>Card Title</strong>
      </CardHeader>
      <CardBody>
        <p style={{ margin: 0 }}>
          This card uses CardHeader, CardBody, and CardFooter to organise its content into distinct
          layout slots.
        </p>
      </CardBody>
      <CardFooter>
        <span style={{ fontSize: '0.875rem', color: 'var(--color-semantic-text-secondary)' }}>
          Footer note
        </span>
      </CardFooter>
    </Card>
  ),
};

export const InteractiveButton: Story = {
  render: () => (
    <Card as="button" variant="elevated" padding="md" onPress={() => {}} style={{ width: 280 }}>
      <CardHeader>
        <strong>Clickable Card</strong>
      </CardHeader>
      <CardBody>Press me to trigger an action.</CardBody>
    </Card>
  ),
};

export const InteractiveLink: Story = {
  render: () => (
    <Card as="a" href="#" variant="outlined" padding="md" style={{ width: 280 }}>
      <CardHeader>
        <strong>Link Card</strong>
      </CardHeader>
      <CardBody>Click to navigate somewhere.</CardBody>
    </Card>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Card
      as="button"
      variant="elevated"
      padding="md"
      isDisabled
      onPress={() => {}}
      style={{ width: 280 }}
    >
      <CardBody>This card is disabled and cannot be pressed.</CardBody>
    </Card>
  ),
};

export const InteractiveHover: Story = {
  render: () => (
    <Card isInteractive variant="elevated" padding="md" style={{ width: 280 }}>
      <CardHeader>
        <strong>Hover Effect</strong>
      </CardHeader>
      <CardBody>Hover over this card to see the elevation lift.</CardBody>
    </Card>
  ),
};
