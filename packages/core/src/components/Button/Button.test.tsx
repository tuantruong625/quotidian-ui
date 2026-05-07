import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FormEvent } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies variant class', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('danger');
  });

  it('applies size class', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('lg');
  });

  it('calls onPress when clicked', async () => {
    const handlePress = vi.fn();
    render(<Button onPress={handlePress}>Click me</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handlePress).toHaveBeenCalledOnce();
  });

  it('does not fire onPress when disabled', async () => {
    const handlePress = vi.fn();
    render(
      <Button onPress={handlePress} isDisabled>
        Click me
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(handlePress).not.toHaveBeenCalled();
  });

  it('disables interaction when loading', async () => {
    const handlePress = vi.fn();
    render(
      <Button onPress={handlePress} isLoading>
        Click me
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(handlePress).not.toHaveBeenCalled();
  });

  it('is focusable via keyboard', async () => {
    render(<Button>Focus me</Button>);
    await userEvent.tab();
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('merges custom className', () => {
    render(<Button className="custom">Styled</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('custom');
  });

  it('supports submit button type in forms', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault());
    render(
      <form onSubmit={handleSubmit}>
        <Button type="submit">Save</Button>
      </form>,
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(handleSubmit).toHaveBeenCalledOnce();
  });
});
