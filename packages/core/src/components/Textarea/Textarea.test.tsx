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

  it('forwards native form props like name and onBlur', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<Textarea id="bio" label="Bio" name="bio" onBlur={onBlur} />);
    const textarea = screen.getByRole('textbox', { name: 'Bio' });

    await user.click(textarea);
    await user.tab();

    expect(textarea).toHaveAttribute('name', 'bio');
    expect(onBlur).toHaveBeenCalled();
  });

  it('supports native disabled/required/readOnly aliases', () => {
    render(<Textarea id="bio" label="Bio" disabled required readOnly />);
    const textarea = screen.getByRole('textbox', { name: 'Bio' });
    expect(textarea).toBeDisabled();
    expect(textarea).toBeRequired();
    expect(textarea).toHaveAttribute('readonly');
  });
});
