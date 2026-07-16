import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Show a container's scrollbar only while the user is moving over or scrolling
 * it, then fade it out `idleMs` after they stop.
 *
 * Pass a ref to the scroll container and pair it with CSS that hides the thumb
 * by default and shows it under `.<container>.scrolling`. A `scrolling` class is
 * added on move/scroll and removed after the idle delay; it's set straight on
 * the element (no React state), so constant pointer movement never re-renders.
 * The listeners and the pending timer are torn down when the consuming component
 * unmounts.
 */
export function useAutoHideScrollbar(ref: RefObject<HTMLElement | null>, idleMs = 1000): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const show = () => {
      el.classList.add('scrolling');
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => el.classList.remove('scrolling'), idleMs);
    };
    el.addEventListener('mousemove', show);
    el.addEventListener('scroll', show, { passive: true });

    return () => {
      if (timer) clearTimeout(timer);
      el.removeEventListener('mousemove', show);
      el.removeEventListener('scroll', show);
    };
  }, [ref, idleMs]);
}
