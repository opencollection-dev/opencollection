import { useEffect, useState } from 'react';

export interface DeviceEnv {
  /** `(any-hover: hover) and (any-pointer: fine)` — any fine, hovering pointer present. */
  anyHoverFine: boolean;
  userAgent: string;
  /** navigator.platform (legacy but still the reliable iPad-unmask signal with maxTouchPoints). */
  platform: string;
  maxTouchPoints: number;
}

/**
 * Whether this device can plausibly run the Bruno desktop app — the gate for
 * showing the Open-in-Bruno CTA. Viewport width is the wrong signal (iPad Pro
 * is 1024–1366px wide), so we look at input capability instead:
 *
 * 1. Require any fine, hovering pointer (`any-*` catches touchscreen laptops /
 *    2-in-1s where the touch digitizer is the primary pointer but a trackpad
 *    exists). A pure touch tablet has neither → excluded.
 * 2. Hard-exclude mobile/tablet OSes that can't run Bruno. iPadOS 13+ reports
 *    as `MacIntel`, so a real Mac (maxTouchPoints === 0) is kept while a touch
 *    iPad (maxTouchPoints > 1) is excluded. This exclusion — not the media
 *    query — is what reliably catches an iPad with a trackpad folio.
 *
 * Pure so it can be unit tested against a device matrix without a DOM.
 */
/**
 * True on a real phone or tablet (including a touch iPad that reports itself as a
 * `MacIntel` desktop). Based on the OS and input, not the window size, so a
 * narrow laptop window - or the docs shrunk next to the inline playground - is
 * never treated as mobile.
 */
export const computeIsMobileOS = ({ userAgent, platform, maxTouchPoints }: DeviceEnv): boolean =>
  /Android|iPhone|iPad|iPod/.test(userAgent) ||
  (platform === 'MacIntel' && maxTouchPoints > 1);

export const computeCanRunBrunoApp = (env: DeviceEnv): boolean =>
  env.anyHoverFine && !computeIsMobileOS(env);

const POINTER_QUERY = '(any-hover: hover) and (any-pointer: fine)';

const readDeviceEnv = (): DeviceEnv => ({
  anyHoverFine: window.matchMedia(POINTER_QUERY).matches,
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  maxTouchPoints: navigator.maxTouchPoints,
});

/**
 * Hook form. Measured eagerly on first render (SSR/no-window safe → `false`),
 * so the CTA's visibility is correct on first paint — no flash. Re-evaluates
 * when the pointer capability changes (e.g. attaching a trackpad / external
 * mouse) by listening to the media query itself — a `resize` event would NOT
 * fire on device attach.
 */
export const useCanRunBrunoApp = (): boolean => {
  const [canRun, setCanRun] = useState(() =>
    typeof window === 'undefined' ? false : computeCanRunBrunoApp(readDeviceEnv())
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(POINTER_QUERY);
    const update = () => setCanRun(computeCanRunBrunoApp(readDeviceEnv()));
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  return canRun;
};

/**
 * True on a real phone or tablet, whatever the window size. The device can't
 * change mid-session, so it's checked once (safe to `false` with no window). Use
 * this, not a width breakpoint, to switch on mobile-only styling, so a narrow
 * laptop window doesn't trigger it.
 */
export const useIsMobileDevice = (): boolean => {
  const [isMobile] = useState(() =>
    typeof window === 'undefined' ? false : computeIsMobileOS(readDeviceEnv())
  );
  return isMobile;
};
