import { describe, it, expect } from 'vitest';
import { formatCollectionVersion, DEFAULT_COLLECTION_VERSION, getInitials, statusToneColor } from './common';

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

describe('getInitials', () => {
  it('uses the first letter of the first two words', () => {
    expect(getInitials('Hotel Booking API')).toBe('HB');
    expect(getInitials('Bruno Testbench')).toBe('BT');
  });

  it('uses only the first letter for a single word', () => {
    expect(getInitials('Echo')).toBe('E');
    expect(getInitials('payments')).toBe('P');
  });

  it('uppercases the result', () => {
    expect(getInitials('hotel booking')).toBe('HB');
  });

  it('collapses extra whitespace', () => {
    expect(getInitials('  Hotel   Booking  ')).toBe('HB');
  });

  it('returns empty string for nullish / blank input', () => {
    expect(getInitials(undefined)).toBe('');
    expect(getInitials(null)).toBe('');
    expect(getInitials('   ')).toBe('');
  });

  it('handles non-letter first characters by taking them verbatim', () => {
    expect(getInitials('1Password Vault')).toBe('1V');
  });
});

describe('statusToneColor', () => {
  it('maps status ranges to their tone token', () => {
    expect(statusToneColor(200)).toBe('var(--oc-status-success-text)');
    expect(statusToneColor(204)).toBe('var(--oc-status-success-text)');
    expect(statusToneColor(404)).toBe('var(--oc-status-danger-text)');
    expect(statusToneColor(500)).toBe('var(--oc-status-danger-text)');
    expect(statusToneColor(301)).toBe('var(--oc-status-info-text)');
  });

  it('falls back to muted when the status is undefined', () => {
    expect(statusToneColor()).toBe('var(--text-muted)');
  });
});
