import { describe, it, expect } from 'vitest';
import { isMacPlatform } from './platform';

describe('isMacPlatform', () => {
  it('detects macOS / iOS by platform', () => {
    expect(isMacPlatform({ platform: 'MacIntel' })).toBe(true);
    expect(isMacPlatform({ platform: 'iPhone' })).toBe(true);
  });
  it('detects macOS by user agent', () => {
    expect(isMacPlatform({ platform: '', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)' })).toBe(true);
  });
  it('is false on Windows / Linux', () => {
    expect(isMacPlatform({ platform: 'Win32' })).toBe(false);
    expect(isMacPlatform({ platform: 'Linux x86_64' })).toBe(false);
  });
});
