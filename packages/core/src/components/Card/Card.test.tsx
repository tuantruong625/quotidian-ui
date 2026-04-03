import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Card, CardHeader, CardBody, CardFooter } from './Card';

describe('Card', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<Card data-testid="card">Hello</Card>);
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('renders as div by default', () => {
      render(<Card data-testid="card" />);
      expect(screen.getByTestId('card').tagName).toBe('DIV');
    });

    it('applies elevated variant class by default', () => {
      render(<Card data-testid="card" />);
      expect(screen.getByTestId('card').className).toContain('elevated');
    });

    it('applies md padding class by default', () => {
      render(<Card data-testid="card" />);
      expect(screen.getByTestId('card').className).toContain('paddingMd');
    });

    it.each(['elevated', 'outlined', 'filled'] as const)('applies %s variant class', (variant) => {
      render(<Card data-testid="card" variant={variant} />);
      expect(screen.getByTestId('card').className).toContain(variant);
    });

    it.each(['none', 'sm', 'md', 'lg'] as const)('applies padding %s class', (padding) => {
      const expectedClass =
        padding === 'none'
          ? 'paddingNone'
          : padding === 'sm'
            ? 'paddingSm'
            : padding === 'md'
              ? 'paddingMd'
              : 'paddingLg';
      render(<Card data-testid="card" padding={padding} />);
      expect(screen.getByTestId('card').className).toContain(expectedClass);
    });
  });

  describe('subcomponents', () => {
    it('CardHeader renders children', () => {
      render(<CardHeader>Header text</CardHeader>);
      expect(screen.getByText('Header text')).toBeInTheDocument();
    });

    it('CardBody renders children', () => {
      render(<CardBody>Body text</CardBody>);
      expect(screen.getByText('Body text')).toBeInTheDocument();
    });

    it('CardFooter renders children', () => {
      render(<CardFooter>Footer text</CardFooter>);
      expect(screen.getByText('Footer text')).toBeInTheDocument();
    });

    it('renders full composition with all subcomponents', () => {
      render(
        <Card data-testid="card">
          <CardHeader>Header</CardHeader>
          <CardBody>Body</CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>,
      );
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Body')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('CardHeader merges custom className', () => {
      render(<CardHeader className="custom-header">H</CardHeader>);
      expect(screen.getByText('H').className).toContain('custom-header');
    });

    it('CardBody merges custom className', () => {
      render(<CardBody className="custom-body">B</CardBody>);
      expect(screen.getByText('B').className).toContain('custom-body');
    });

    it('CardFooter merges custom className', () => {
      render(<CardFooter className="custom-footer">F</CardFooter>);
      expect(screen.getByText('F').className).toContain('custom-footer');
    });
  });

  describe('polymorphic', () => {
    it('renders as article when as="article"', () => {
      render(<Card as="article" data-testid="card" />);
      expect(screen.getByTestId('card').tagName).toBe('ARTICLE');
    });

    it('renders as button when as="button"', () => {
      render(<Card as="button" onPress={vi.fn()} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders as anchor when as="a"', () => {
      render(<Card as="a" href="/detail" data-testid="card" />);
      expect(screen.getByTestId('card').tagName).toBe('A');
    });
  });

  describe('interactive', () => {
    it('applies interactive class when isInteractive is true', () => {
      render(<Card data-testid="card" isInteractive />);
      expect(screen.getByTestId('card').className).toContain('interactive');
    });

    it('applies interactive class when as="button"', () => {
      render(<Card as="button" onPress={vi.fn()} />);
      expect(screen.getByRole('button').className).toContain('interactive');
    });

    it('calls onPress when clicked as a button', async () => {
      const handlePress = vi.fn();
      render(<Card as="button" onPress={handlePress} />);
      await userEvent.click(screen.getByRole('button'));
      expect(handlePress).toHaveBeenCalledOnce();
    });

    it('does not call onPress when isDisabled', async () => {
      const handlePress = vi.fn();
      render(<Card as="button" onPress={handlePress} isDisabled />);
      await userEvent.click(screen.getByRole('button'));
      expect(handlePress).not.toHaveBeenCalled();
    });

    it('applies disabled class when isDisabled', () => {
      render(<Card as="button" isDisabled onPress={vi.fn()} />);
      expect(screen.getByRole('button').className).toContain('disabled');
    });

    it('marks button as disabled when isDisabled', () => {
      render(<Card as="button" isDisabled onPress={vi.fn()} />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('interactive button is focusable', () => {
      render(<Card as="button" onPress={vi.fn()} />);
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to the root element', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Card ref={ref} data-testid="card" />);
      expect(ref.current).not.toBeNull();
      expect(ref.current).toBe(screen.getByTestId('card'));
    });
  });

  describe('className merging', () => {
    it('merges custom className on Card', () => {
      render(<Card data-testid="card" className="my-card" />);
      expect(screen.getByTestId('card').className).toContain('my-card');
    });
  });
});
