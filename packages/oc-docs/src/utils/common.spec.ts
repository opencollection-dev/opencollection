import { describe, it, expect } from 'vitest';
import { getInitials, statusToneColor } from './common';

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
