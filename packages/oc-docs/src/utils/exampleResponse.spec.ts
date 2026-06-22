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

  it('maps response body types to languages', () => {
    expect(responseBodyLanguage('json')).toBe('json');
    expect(responseBodyLanguage('html')).toBe('markup');
    expect(responseBodyLanguage('binary')).toBe('text');
    expect(responseBodyLanguage(undefined)).toBe('text');
  });
});
