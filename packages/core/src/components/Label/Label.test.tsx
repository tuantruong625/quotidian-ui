import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Label } from './Label';

describe('Label', () => {
  it('renders label text', () => {
    render(<Label>Email</Label>);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders required marker', () => {
    render(<Label required>Password</Label>);
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
