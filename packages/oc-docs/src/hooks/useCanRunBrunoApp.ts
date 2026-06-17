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

const readDeviceEnv = (): DeviceEnv => ({
  anyHoverFine: window.matchMedia('(any-hover: hover) and (any-pointer: fine)').matches,
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  maxTouchPoints: navigator.maxTouchPoints,
});

/**
 * Hook form. Defaults to `false` until the first client measure (SSR/no-window
 * safe and avoids flashing the CTA on touch devices). Re-evaluates on resize so
 * attaching a trackpad / external mouse can light the CTA up.
 */
export const useCanRunBrunoApp = (): boolean => {
  const [canRun, setCanRun] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => setCanRun(computeCanRunBrunoApp(readDeviceEnv()));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return canRun;
};
