import { describe, it, expect } from 'vitest';
import { cx } from './cx';

describe('cx', () => {
  it('joins string arguments with a space', () => {
    expect(cx('a', 'b', 'c')).toBe('a b c');
  });

  it('skips falsy values (false / null / undefined / empty string)', () => {
    expect(cx('a', false, null, undefined, '', 'b')).toBe('a b');
  });

  it('includes truthy numbers and skips 0', () => {
    expect(cx(1, 2)).toBe('1 2');
    expect(cx(0, 'a')).toBe('a');
  });

  it('applies object keys whose value is truthy', () => {
    expect(cx({ a: true, b: false, c: true, d: undefined })).toBe('a c');
  });

  it('flattens arrays, including nested ones', () => {
    expect(cx(['a', ['b', ['c']]], 'd')).toBe('a b c d');
  });

  it('mixes strings, arrays, and objects; skips falsy throughout', () => {
    expect(cx('a', ['b', { c: true, d: false }], { e: true }, null)).toBe('a b c e');
  });

  it('returns an empty string for no or entirely blank input', () => {
    expect(cx()).toBe('');
    expect(cx(false, null, undefined, {}, [])).toBe('');
  });

  it('does not de-duplicate (matches the classnames package)', () => {
    expect(cx('a', 'a')).toBe('a a');
  });
});
