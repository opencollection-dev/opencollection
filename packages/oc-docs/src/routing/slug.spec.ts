import { describe, it, expect } from 'vitest';
import type { HttpRequest } from '@opencollection/types/requests/http';
import {
  slugifySegment,
  dedupeSiblingSlugs,
  exampleSlugs,
  exampleNames,
  exampleIndexForSlug,
  exampleSlugForIndex,
} from './slug';

const request = (...names: string[]): HttpRequest =>
  ({ examples: names.map((name) => ({ name })) } as unknown as HttpRequest);

describe('slugifySegment', () => {
  it('kebab-cases a plain name (spaces become single dashes)', () => {
    expect(slugifySegment('Create Booking')).toBe('create-booking');
    expect(slugifySegment('List  customers')).toBe('list-customers');
  });

  it('keeps existing hyphens and underscores', () => {
    expect(slugifySegment('refresh_token-v2')).toBe('refresh_token-v2');
  });

  it('trims leading and trailing whitespace/dashes', () => {
    expect(slugifySegment('  Login  ')).toBe('login');
    expect(slugifySegment('-Login-')).toBe('login');
  });

  it('percent-encodes special characters (kept unique, not collapsed)', () => {
    expect(slugifySegment('Customers/%$')).toBe('customers%2F%25%24');
    expect(slugifySegment('Q&A')).toBe('q%26a');
    expect(slugifySegment('Browse & Search')).toBe('browse-%26-search');
  });

  it('distinguishes names that differ only by their special characters', () => {
    expect(slugifySegment('customers/$')).not.toBe(slugifySegment('customers/&'));
  });

  it('percent-encodes non-ASCII (accents / unicode) with UTF-8 bytes', () => {
    expect(slugifySegment('résumé')).toBe('r%C3%A9sum%C3%A9');
  });

  it('falls back to "unnamed" only when there is nothing to encode', () => {
    expect(slugifySegment('')).toBe('unnamed');
    expect(slugifySegment('   ')).toBe('unnamed');
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

describe('exampleSlugs', () => {
  it('slugifies example names in array order', () => {
    expect(exampleSlugs(['Successful login', 'Invalid credentials'])).toEqual([
      'successful-login',
      'invalid-credentials',
    ]);
  });

  it('falls back to example-<1-based-index> for blank names', () => {
    expect(exampleSlugs(['', undefined, '  '])).toEqual(['example-1', 'example-2', 'example-3']);
  });

  it('de-duplicates colliding slugs with -2, -3', () => {
    expect(exampleSlugs(['Login', 'login', 'LOGIN'])).toEqual(['login', 'login-2', 'login-3']);
  });

  it('is stable under reorder (name-based, not index-based)', () => {
    const forward = exampleSlugs(['OK', 'Unauthorized']);
    const reversed = exampleSlugs(['Unauthorized', 'OK']);
    expect(forward).toEqual(['ok', 'unauthorized']);
    expect(reversed).toEqual(['unauthorized', 'ok']);
  });
});

describe('exampleNames', () => {
  it('reads names in array order', () => {
    expect(exampleNames(request('OK', 'Unauthorized'))).toEqual(['OK', 'Unauthorized']);
  });

  it('is empty for a request with no examples or a null request', () => {
    expect(exampleNames({} as HttpRequest)).toEqual([]);
    expect(exampleNames(null)).toEqual([]);
  });
});

describe('exampleIndexForSlug', () => {
  it('returns the index of a matching example slug', () => {
    expect(exampleIndexForSlug(request('OK', 'Unauthorized'), 'unauthorized')).toBe(1);
  });

  it('returns null for an unknown/stale slug or a null request', () => {
    expect(exampleIndexForSlug(request('OK', 'Unauthorized'), 'does-not-exist')).toBeNull();
    expect(exampleIndexForSlug(null, 'ok')).toBeNull();
  });
});

describe('exampleSlugForIndex', () => {
  it('returns the slug at a given index', () => {
    expect(exampleSlugForIndex(request('OK', 'Unauthorized'), 1)).toBe('unauthorized');
  });

  it('returns null for an out-of-range index or a null request', () => {
    expect(exampleSlugForIndex(request('OK'), 5)).toBeNull();
    expect(exampleSlugForIndex(null, 0)).toBeNull();
  });

  it('round-trips with exampleIndexForSlug', () => {
    const req = request('OK', 'Unauthorized', 'OK');
    const slug = exampleSlugForIndex(req, 2);
    expect(slug).toBe('ok-2');
    expect(exampleIndexForSlug(req, slug!)).toBe(2);
  });
});
