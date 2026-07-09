import { useEffect, useLayoutEffect, useState } from 'react';

// Layout effect on the client (measure before paint), plain effect on the
// server (no DOM, and useLayoutEffect would warn during SSR/static render).
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Observe an element's width in px via ResizeObserver. Measures synchronously in
 * a layout effect (before paint) so consumers get the real width on first paint
 * rather than 0 (avoids a one-frame layout flash). Returns 0 until first
 * measurement and when ResizeObserver is unavailable.
 */
export const useElementWidth = (ref: React.RefObject<HTMLElement | null>): number => {
  const [width, setWidth] = useState(0);
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Seed synchronously so the first painted frame already has the width.
    setWidth(Math.round(el.getBoundingClientRect().width));
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setWidth(Math.round(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return width;
};
