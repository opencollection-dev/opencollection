import { describe, it, expect } from 'vitest';
import { hasCollectionConfiguration } from './collectionConfiguration';

describe('hasCollectionConfiguration', () => {
  it('is false for an empty collection', () => {
    expect(hasCollectionConfiguration()).toBe(false);
    expect(hasCollectionConfiguration([], undefined, {})).toBe(false);
  });

  it('ignores disabled or nameless headers', () => {
    expect(hasCollectionConfiguration([{ name: '', value: 'x' }])).toBe(false);
    expect(hasCollectionConfiguration([{ name: 'Accept', value: 'json', disabled: true }])).toBe(false);
  });

  it('is true when an enabled, named header is present', () => {
    expect(hasCollectionConfiguration([{ name: 'Accept', value: 'application/json' }])).toBe(true);
  });

  it('is true when auth is configured', () => {
    expect(hasCollectionConfiguration([], { type: 'bearer', token: 't' })).toBe(true);
  });

  it('is true when any script is present', () => {
    expect(hasCollectionConfiguration([], undefined, { preRequest: 'x' })).toBe(true);
    expect(hasCollectionConfiguration([], undefined, { postResponse: 'y' })).toBe(true);
    expect(hasCollectionConfiguration([], undefined, { tests: 'z' })).toBe(true);
  });
});
