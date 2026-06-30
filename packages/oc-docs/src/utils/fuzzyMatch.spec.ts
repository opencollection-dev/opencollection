import { describe, it, expect } from 'vitest';
import { fuzzyScore } from './fuzzyMatch';

describe('fuzzyScore', () => {
  it('empty query scores 0 (matches anything)', () => {
    expect(fuzzyScore('', 'anything')).toBe(0);
  });

  it('empty text never matches a non-empty query', () => {
    expect(fuzzyScore('a', '')).toBeNull();
  });

  it('returns null when query is not a subsequence', () => {
    expect(fuzzyScore('xyz', 'hotel')).toBeNull();
    expect(fuzzyScore('hotels!', 'hotel')).toBeNull(); // longer than text
  });

  it('matches a contiguous substring', () => {
    expect(fuzzyScore('hot', 'hotel')).not.toBeNull();
  });

  it('matches a non-contiguous subsequence', () => {
    expect(fuzzyScore('htl', 'hotel')).not.toBeNull();
  });

  it('is case-insensitive', () => {
    expect(fuzzyScore('HOT', 'hotel')).not.toBeNull();
    expect(fuzzyScore('hot', 'HOTEL')).not.toBeNull();
  });

  it('ranks a prefix match above a scattered one', () => {
    const prefix = fuzzyScore('book', 'booking')!;
    const scattered = fuzzyScore('book', 'bxoxoxk')!;
    expect(prefix).toBeGreaterThan(scattered);
  });

  it('rewards word-boundary matches (after / or space)', () => {
    const boundary = fuzzyScore('hotels', '/api/v1/hotels')!;
    const midword = fuzzyScore('otels', 'xhotelsx')!;
    expect(boundary).toBeGreaterThan(midword);
  });

  it('ranks contiguous runs above gappy matches of the same chars', () => {
    const contiguous = fuzzyScore('get', 'get')!;
    const gappy = fuzzyScore('get', 'g-e-t')!;
    expect(contiguous).toBeGreaterThan(gappy);
  });

  it('prefers shorter (tighter) text on equal matches', () => {
    const short = fuzzyScore('hotel', 'hotel')!;
    const long = fuzzyScore('hotel', 'hotel reservations endpoint long name')!;
    expect(short).toBeGreaterThan(long);
  });
});
