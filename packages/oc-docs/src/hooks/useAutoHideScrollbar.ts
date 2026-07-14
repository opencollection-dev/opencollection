import { useCallback, useRef } from 'react';

/**
 * Wire an element's scrollbar to show only while the user is active over it.
 *
 * Adds a `scrolling` class on mousemove/scroll and removes it `idleMs` after the
 * last activity, so a `::-webkit-scrollbar-thumb` that is transparent by default
 * and coloured under `.scrolling` fades out when the pointer goes idle. The class
 * is toggled directly on the node (no React state) so pointer noise never
 * re-renders. Returns a cleanup that clears the timer and removes the listeners.
 *
 * Split out of the hook so it can be unit-tested without a DOM/renderer.
 */
export function attachAutoHideScrollbar(el: HTMLElement, idleMs = 1000): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const show = (): void => {
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
 * React wrapper around {@link attachAutoHideScrollbar}. Returns a ref callback to
 * put on the scroll container; pair it with CSS that hides the thumb by default
 * and shows it under `.<container>.scrolling`.
 *
 * A ref callback (not a RefObject effect) so it (re)attaches whenever the node
 * actually mounts or changes, and detaches on unmount. This keeps it correct for
 * a container that only renders later (e.g. after a loading state), which a
 * mount-only effect over a RefObject would silently miss.
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
