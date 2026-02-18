import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
	it('renders children', () => {
		render(<Button>Click me</Button>);
		expect(screen.getByText('Click me')).toBeInTheDocument();
	});

	it('defaults to primary variant', () => {
		render(<Button>Click me</Button>);
		expect(screen.getByText('Click me')).toHaveAttribute(
			'data-variant',
			'primary',
		);
	});
});
