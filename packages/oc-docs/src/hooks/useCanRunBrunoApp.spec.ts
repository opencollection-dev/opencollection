import { describe, it, expect } from 'vitest';
import { computeCanRunBrunoApp, type DeviceEnv } from './useCanRunBrunoApp';

const base: DeviceEnv = {
  anyHoverFine: true,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605',
  platform: 'MacIntel',
  maxTouchPoints: 0,
};

describe('computeCanRunBrunoApp', () => {
  it('allows a real desktop (fine pointer, no touch)', () => {
    expect(computeCanRunBrunoApp(base)).toBe(true);
  });

  it('allows a touchscreen Windows laptop (any fine pointer present)', () => {
    expect(
      computeCanRunBrunoApp({
        anyHoverFine: true,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120',
        platform: 'Win32',
        maxTouchPoints: 10,
      })
    ).toBe(true);
  });

  it('excludes iPadOS masquerading as Mac (MacIntel + touch points)', () => {
    expect(
      computeCanRunBrunoApp({
        anyHoverFine: true, // iPad + trackpad folio can report this
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605',
        platform: 'MacIntel',
        maxTouchPoints: 5,
      })
    ).toBe(false);
  });

  it('excludes an iPad that still reports iPad in the UA', () => {
    expect(
      computeCanRunBrunoApp({
        anyHoverFine: true,
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) Safari/604',
        platform: 'iPad',
        maxTouchPoints: 5,
      })
    ).toBe(false);
  });

  it('excludes Android / iPhone', () => {
    expect(computeCanRunBrunoApp({ ...base, anyHoverFine: false, userAgent: 'Android 13', platform: 'Linux armv8l', maxTouchPoints: 5 })).toBe(false);
    expect(computeCanRunBrunoApp({ ...base, anyHoverFine: false, userAgent: 'iPhone OS 16', platform: 'iPhone', maxTouchPoints: 5 })).toBe(false);
  });

  it('excludes a pure touch tablet (no fine pointer)', () => {
    expect(
      computeCanRunBrunoApp({
        anyHoverFine: false,
        userAgent: 'Mozilla/5.0 (Linux; Android 13; Tab)',
        platform: 'Linux armv8l',
        maxTouchPoints: 10,
      })
    ).toBe(false);
  });

  it('keeps a real Mac (MacIntel, zero touch points)', () => {
    expect(computeCanRunBrunoApp({ ...base, maxTouchPoints: 0 })).toBe(true);
  });
});
