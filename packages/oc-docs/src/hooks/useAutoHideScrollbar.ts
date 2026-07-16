import { useCallback, useRef } from 'react';

/**
 * Show a container's scrollbar only while the user is moving over or scrolling
 * it, then fade it out `idleMs` after they stop.
 *
 * Adds a `scrolling` class on move/scroll and removes it after the idle delay;
 * pair with CSS that hides the thumb by default and shows it under `.scrolling`.
 * The class is set straight on the element (no React state), so constant pointer
 * movement never re-renders. Returns a cleanup that stops the timer and removes
 * the listeners. Kept separate from the hook so it can be tested without a DOM.
 */
export function attachAutoHideScrollbar(el: HTMLElement, idleMs = 1000): () => void {
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
}

/**
 * Hook form of {@link attachAutoHideScrollbar}. Put the returned callback on the
 * scroll container's `ref`, and pair it with CSS that hides the thumb by default
 * and shows it under `.<container>.scrolling`.
 *
 * It's a ref callback, so it re-wires whenever the container actually appears or
 * changes and cleans up when it goes away - which also works when the container
 * only shows up later (e.g. after a loading state).
 */
export function useAutoHideScrollbar<T extends HTMLElement = HTMLElement>(
  idleMs = 1000
): (el: T | null) => void {
  const cleanupRef = useRef<(() => void) | null>(null);
  return useCallback(
    (el: T | null) => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      if (el) cleanupRef.current = attachAutoHideScrollbar(el, idleMs);
    },
    [idleMs]
  );
}
