import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('joins string classes', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('filters out falsy values', () => {
    expect(cn('foo', false, null, undefined, 'bar')).toBe('foo bar');
  });

  it('handles object syntax', () => {
    expect(cn('foo', { bar: true, baz: false })).toBe('foo bar');
  });

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('');
  });
});
