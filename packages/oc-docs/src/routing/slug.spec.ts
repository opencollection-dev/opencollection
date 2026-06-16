import { describe, it, expect } from 'vitest';
import { slugifySegment, dedupeSiblingSlugs } from './slug';

describe('slugifySegment', () => {
  it('kebab-cases a plain name', () => {
    expect(slugifySegment('Create Booking')).toBe('create-booking');
  });

  it('lowercases and collapses non-alphanumerics to single dashes', () => {
    expect(slugifySegment('Browse & Search')).toBe('browse-search');
  });

  it('trims leading and trailing dashes', () => {
    expect(slugifySegment('  /Login/  ')).toBe('login');
  });

  it('keeps existing hyphens and underscores', () => {
    expect(slugifySegment('refresh_token-v2')).toBe('refresh_token-v2');
  });

  it('falls back for empty / unnamed input', () => {
    expect(slugifySegment('')).toBe('unnamed');
    expect(slugifySegment('***')).toBe('unnamed');
  });
});

describe('dedupeSiblingSlugs', () => {
  it('leaves unique segments untouched', () => {
    expect(dedupeSiblingSlugs(['login', 'register', 'refresh'])).toEqual([
      'login',
      'register',
      'refresh',
    ]);
  });

  it('suffixes -2, -3 for repeated segments in order', () => {
    expect(dedupeSiblingSlugs(['login', 'login', 'login'])).toEqual([
      'login',
      'login-2',
      'login-3',
    ]);
  });

  it('does not let a suffixed slug collide with an existing one', () => {
    // 'login' already taken by index 0; the literal 'login-2' at index 1 must
    // not be silently re-handed to a later duplicate of 'login'.
    expect(dedupeSiblingSlugs(['login', 'login-2', 'login'])).toEqual([
      'login',
      'login-2',
      'login-3',
    ]);
  });
});
