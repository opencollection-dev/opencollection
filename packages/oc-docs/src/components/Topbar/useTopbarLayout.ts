import { useEffect, useState } from 'react';

/**
 * Responsive modes for the Topbar.
 * - `mobile`  (<768): single condensed row; hamburger + search-icon + overflow.
 * - `tablet`  (768–1023): sidebar is inline, search narrows, CTA is icon-only.
 * - `desktop` (>=1024): full bar with centered search.
 *
 * Breakpoints mirror the theme tokens `--oc-breakpoint-tablet` (768) and
 * `--oc-breakpoint-large` (1024).
 */
export type TopbarLayoutMode = 'mobile' | 'tablet' | 'desktop';

export const TOPBAR_TABLET_MIN = 768;
export const TOPBAR_DESKTOP_MIN = 1024;

/** Pure width → mode mapping. Unit-testable without a DOM. */
export const layoutModeForWidth = (width: number): TopbarLayoutMode => {
  if (width >= TOPBAR_DESKTOP_MIN) return 'desktop';
  if (width >= TOPBAR_TABLET_MIN) return 'tablet';
  return 'mobile';
};

/** Hamburger trigger only shows below the sidebar-inline breakpoint (mobile). */
export const showsHamburger = (mode: TopbarLayoutMode): boolean => mode === 'mobile';

/**
 * Tracks the current layout mode from the viewport width.
 * SSR/no-window safe: defaults to `desktop` until the first client measure.
 */
export const useTopbarLayout = (): TopbarLayoutMode => {
  const [mode, setMode] = useState<TopbarLayoutMode>(() =>
    typeof window === 'undefined' ? 'desktop' : layoutModeForWidth(window.innerWidth)
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Bail out when the band is unchanged so dragging the window edge doesn't
    // trigger a render on every resize tick (only on actual band crossings).
    const onResize = () => {
      const next = layoutModeForWidth(window.innerWidth);
      setMode((prev) => (prev === next ? prev : next));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return mode;
};
