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
export const computeCanRunBrunoApp = ({
  anyHoverFine,
  userAgent,
  platform,
  maxTouchPoints,
}: DeviceEnv): boolean => {
  const isMobileOS =
    /Android|iPhone|iPad|iPod/.test(userAgent) ||
    (platform === 'MacIntel' && maxTouchPoints > 1);
  return anyHoverFine && !isMobileOS;
};

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
