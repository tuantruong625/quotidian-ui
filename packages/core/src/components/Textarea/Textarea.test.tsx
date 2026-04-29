import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders label', () => {
    render(<Textarea id="bio" label="Bio" />);
    expect(screen.getByText('Bio')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea id="bio" label="Bio" onChange={onChange} />);
    await user.type(screen.getByRole('textbox', { name: 'Bio' }), 'hello');
    expect(onChange).toHaveBeenCalled();
  });
});
