import { describe, it, expect } from 'vitest';
import { computeBodySize, formatBytes, responseBodyLanguage } from './exampleResponse';

describe('exampleResponse', () => {
  it('computes byte size (UTF-8 aware)', () => {
    expect(computeBodySize('abc')).toBe(3);
    expect(computeBodySize('é')).toBe(2);
    expect(computeBodySize(undefined)).toBe(0);
  });

  it('formats byte counts in KB (KB minimum, MB for large)', () => {
    expect(formatBytes(67)).toBe('0.1KB');
    expect(formatBytes(2355)).toBe('2.3KB');
    expect(formatBytes(50 * 1024)).toBe('50KB');
    expect(formatBytes(5 * 1024 * 1024)).toBe('5.0MB');
  });

  it('shows KB as the smallest unit (sub-KB and zero round into KB)', () => {
    expect(formatBytes(0)).toBe('0.0KB');
    expect(formatBytes(512)).toBe('0.5KB');
    expect(formatBytes(1024)).toBe('1.0KB');
    expect(formatBytes(1536)).toBe('1.5KB');
  });

  it('uses 1 decimal under 10 and 0 decimals at/above 10 (per unit)', () => {
    expect(formatBytes(9 * 1024)).toBe('9.0KB'); // <10 → 1 decimal
    expect(formatBytes(10 * 1024)).toBe('10KB'); // >=10 → 0 decimals
    expect(formatBytes(1.5 * 1024 * 1024)).toBe('1.5MB'); // <10 → 1 decimal
    expect(formatBytes(10 * 1024 * 1024)).toBe('10MB'); // >=10 → 0 decimals
    expect(formatBytes(100 * 1024 * 1024)).toBe('100MB');
  });

  it('promotes to MB at the KB rounding boundary (never displays "1024KB")', () => {
    expect(formatBytes(1023 * 1024)).toBe('1023KB'); // just below the boundary stays KB
    expect(formatBytes(1024 * 1024 - 1)).toBe('1.0MB'); // 1023.999KB rounds to 1024 → promote
    expect(formatBytes(1024 * 1024)).toBe('1.0MB'); // exactly 1MB
  });

  it('maps response body types to languages', () => {
    expect(responseBodyLanguage('json')).toBe('json');
    expect(responseBodyLanguage('html')).toBe('markup');
    expect(responseBodyLanguage('binary')).toBe('text');
    expect(responseBodyLanguage(undefined)).toBe('text');
  });
});
