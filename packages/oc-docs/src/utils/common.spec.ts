import { describe, it, expect } from 'vitest';
import { formatCollectionVersion, DEFAULT_COLLECTION_VERSION } from './common';

describe('formatCollectionVersion', () => {
  it('pads numeric versions to a full major.minor.patch with a "v" prefix', () => {
    expect(formatCollectionVersion('1')).toBe('v1.0.0');
    expect(formatCollectionVersion('2.1')).toBe('v2.1.0');
    expect(formatCollectionVersion('1.0.0')).toBe('v1.0.0');
    expect(formatCollectionVersion('3.4.5')).toBe('v3.4.5');
  });

  it('does not double-prefix an existing "v"/"V"', () => {
    expect(formatCollectionVersion('v2.1')).toBe('v2.1.0');
    expect(formatCollectionVersion('V3')).toBe('v3.0.0');
  });

  it('coerces numbers to a normalised version', () => {
    expect(formatCollectionVersion(1)).toBe('v1.0.0');
  });

  it('keeps extra numeric segments without truncating', () => {
    expect(formatCollectionVersion('1.2.3.4')).toBe('v1.2.3.4');
  });

  it('shows non-numeric / pre-release versions as-is (only prefixed)', () => {
    expect(formatCollectionVersion('1.0.0-beta')).toBe('v1.0.0-beta');
  });

  it('falls back to the default when no version is set', () => {
    expect(formatCollectionVersion(undefined)).toBe(DEFAULT_COLLECTION_VERSION);
    expect(formatCollectionVersion(null)).toBe(DEFAULT_COLLECTION_VERSION);
    expect(formatCollectionVersion('')).toBe(DEFAULT_COLLECTION_VERSION);
    expect(formatCollectionVersion('   ')).toBe(DEFAULT_COLLECTION_VERSION);
  });
});
