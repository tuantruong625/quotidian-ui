import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders with aria-busy when isBusy', () => {
    render(<Skeleton isBusy data-testid="sk" />);
    expect(screen.getByTestId('sk')).toHaveAttribute('aria-busy', 'true');
  });
});
