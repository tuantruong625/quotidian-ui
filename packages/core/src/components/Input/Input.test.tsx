import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders label and placeholder', () => {
    render(<Input id="email" label="Email" placeholder="you@example.com" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input id="email" label="Email" onChange={handleChange} />);

    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'a');
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error message when invalid', () => {
    render(<Input id="email" label="Email" isInvalid errorMessage="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('disables input while loading', () => {
    render(<Input id="email" label="Email" isLoading />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeDisabled();
  });
});
