import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from './Progress';

describe('Progress', () => {
  it('exposes progressbar role with value', () => {
    render(<Progress label="Load" value={40} minValue={0} maxValue={100} />);
    const bar = screen.getByRole('progressbar', { name: 'Load' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
  });
});
