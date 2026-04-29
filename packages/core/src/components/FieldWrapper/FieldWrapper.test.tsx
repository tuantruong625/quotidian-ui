import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FieldWrapper } from './FieldWrapper';

describe('FieldWrapper', () => {
  it('renders label and helper text', () => {
    render(
      <FieldWrapper id="name" label="Name" helperText="Enter full name">
        <input id="name" />
      </FieldWrapper>,
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Enter full name')).toBeInTheDocument();
  });

  it('prioritizes error message when invalid', () => {
    render(
      <FieldWrapper id="name" label="Name" helperText="helper" isInvalid errorMessage="error">
        <input id="name" />
      </FieldWrapper>,
    );

    expect(screen.getByText('error')).toBeInTheDocument();
    expect(screen.queryByText('helper')).not.toBeInTheDocument();
  });
});
