import { useEffect } from 'react';
import type { RefObject } from 'react';

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
 * React wrapper around {@link attachAutoHideScrollbar}. Pass a ref to the scroll
 * container; pair it with CSS that hides the thumb by default and shows it under
 * `.<container>.scrolling`.
 */
export function useAutoHideScrollbar(ref: RefObject<HTMLElement | null>, idleMs = 1000): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return attachAutoHideScrollbar(el, idleMs);
  }, [ref, idleMs]);
}
