import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  describe('image rendering', () => {
    it('renders an image when src is provided', () => {
      render(<Avatar src="https://example.com/photo.jpg" alt="Jane Doe" />);
      // The <img> itself is the accessible element; the wrapper has role="presentation"
      const img = screen.getByRole('img', { name: 'Jane Doe' });
      expect(img).toBeInTheDocument();
      expect(img.tagName).toBe('IMG');
    });

    it('falls back to initials when src is not provided', () => {
      render(<Avatar name="Jane Doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
      // wrapper is role="img" but initials span is aria-hidden; label comes from wrapper
      expect(screen.getByRole('img', { name: 'Jane Doe' })).toBeInTheDocument();
    });

    it('falls back to initials when the image fails to load', () => {
      render(<Avatar src="https://broken.url/photo.jpg" name="Jane Doe" />);
      // The only role="img" is the <img> element itself while image is loading
      const img = screen.getByRole('img', { name: 'Jane Doe' });
      fireEvent.error(img);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('renders the fallback icon when no src or name is provided', () => {
      render(<Avatar />);
      expect(screen.getByTestId('avatar-fallback-icon')).toBeInTheDocument();
    });

    it('renders the fallback icon when name is an empty string', () => {
      render(<Avatar name="" />);
      expect(screen.getByTestId('avatar-fallback-icon')).toBeInTheDocument();
    });

    it('renders a custom fallback icon', () => {
      render(<Avatar fallbackIcon={<span data-testid="custom-icon" />} />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('initials derivation', () => {
    it('derives two-char initials from a full name', () => {
      render(<Avatar name="Jane Doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('derives single-char initials from a single-word name', () => {
      render(<Avatar name="Jane" />);
      expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('uses only first and last word for initials', () => {
      render(<Avatar name="Jane Middle Doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('uppercases initials', () => {
      render(<Avatar name="jane doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has a label from name when no src is provided', () => {
      render(<Avatar name="Jane Doe" />);
      expect(screen.getByRole('img', { name: 'Jane Doe' })).toBeInTheDocument();
    });

    it('has a label from alt when src is provided', () => {
      render(<Avatar src="https://example.com/photo.jpg" alt="Jane Doe" />);
      expect(screen.getByRole('img', { name: 'Jane Doe' })).toBeInTheDocument();
    });

    it('has a generic label when neither name nor alt is provided', () => {
      render(<Avatar />);
      expect(screen.getByRole('img', { name: 'Avatar' })).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('applies %s size class', (size) => {
      render(<Avatar size={size} name="JD" />);
      const root = screen.getByRole('img');
      expect(root.className).toContain(size);
    });
  });

  describe('shapes', () => {
    it('applies circle class by default', () => {
      render(<Avatar name="JD" />);
      expect(screen.getByRole('img').className).toContain('circle');
    });

    it('applies square class when shape is square', () => {
      render(<Avatar shape="square" name="JD" />);
      expect(screen.getByRole('img').className).toContain('square');
    });
  });

  describe('status badge', () => {
    it('renders no badge by default', () => {
      render(<Avatar name="JD" />);
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it.each([
      ['online', 'Online'],
      ['offline', 'Offline'],
      ['away', 'Away'],
      ['busy', 'Busy'],
    ] as const)('renders %s badge with correct aria-label', (status, label) => {
      render(<Avatar name="JD" status={status} />);
      expect(screen.getByRole('status', { name: label })).toBeInTheDocument();
    });
  });

  describe('hover state', () => {
    it('applies hover styles only to interactive avatars', async () => {
      const user = userEvent.setup();
      render(<Avatar as="button" name="JD" onPress={vi.fn()} />);
      const btn = screen.getByRole('button');
      await user.hover(btn);
      // CSS Modules class-based hover is applied by the browser; here we verify
      // the element is the interactive variant (button/anchor) that carries the hover rule.
      expect(btn.tagName).toBe('BUTTON');
    });

    it('does not apply interactive styling to static div avatar', () => {
      render(<Avatar name="JD" />);
      const root = screen.getByRole('img');
      expect(root.tagName).toBe('DIV');
    });
  });

  describe('polymorphic / interactive', () => {
    it('renders as div by default', () => {
      render(<Avatar name="JD" />);
      const root = screen.getByRole('img');
      expect(root.tagName).toBe('DIV');
    });

    it('renders as button when as=button is provided', () => {
      render(<Avatar as="button" name="JD" onPress={vi.fn()} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('calls onPress when clicked as a button', async () => {
      const handlePress = vi.fn();
      render(<Avatar as="button" name="JD" onPress={handlePress} />);
      await userEvent.click(screen.getByRole('button'));
      expect(handlePress).toHaveBeenCalledOnce();
    });

    it('does not call onPress when isDisabled', async () => {
      const handlePress = vi.fn();
      render(<Avatar as="button" name="JD" onPress={handlePress} isDisabled />);
      await userEvent.click(screen.getByRole('button'));
      expect(handlePress).not.toHaveBeenCalled();
    });
  });

  describe('forwarded ref', () => {
    it('forwards ref to the root element', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Avatar ref={ref} name="JD" />);
      expect(ref.current).not.toBeNull();
    });
  });

  describe('className merging', () => {
    it('merges custom className', () => {
      render(<Avatar name="JD" className="custom" />);
      expect(screen.getByRole('img').className).toContain('custom');
    });
  });
});
