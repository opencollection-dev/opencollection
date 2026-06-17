import { describe, it, expect } from 'vitest';
import { buildBrunoDeepLink } from './buildBrunoDeepLink';

describe('buildBrunoDeepLink', () => {
  it('builds a bruno:// git-import deep link', () => {
    expect(buildBrunoDeepLink('https://github.com/usebruno/bruno-testbench.git')).toBe(
      'bruno://app/collection/import/git?url=https%3A%2F%2Fgithub.com%2Fusebruno%2Fbruno-testbench.git'
    );
  });

  it('url-encodes query-string-breaking characters', () => {
    expect(buildBrunoDeepLink('https://host/repo.git?token=a&b=c')).toContain(
      encodeURIComponent('https://host/repo.git?token=a&b=c')
    );
  });

  it('returns undefined for nullish / empty / whitespace input', () => {
    expect(buildBrunoDeepLink(undefined)).toBeUndefined();
    expect(buildBrunoDeepLink(null)).toBeUndefined();
    expect(buildBrunoDeepLink('')).toBeUndefined();
    expect(buildBrunoDeepLink('   ')).toBeUndefined();
  });

  it('trims surrounding whitespace before encoding', () => {
    expect(buildBrunoDeepLink('  https://h/r.git  ')).toBe(
      'bruno://app/collection/import/git?url=https%3A%2F%2Fh%2Fr.git'
    );
  });
});
