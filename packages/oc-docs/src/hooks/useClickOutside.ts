import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Calls `onClose` on a pointerdown outside `ref` while `enabled`. Uses
 * pointerdown (not mousedown) so it fires uniformly for mouse, touch and pen;
 * on touch, mousedown is only a compatibility event and can be suppressed.
 * Shared by the search panel and the filter dropdowns so the close-on-outside
 * behaviour lives in one place.
 */
export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  enabled = true,
): void => {
  useEffect(() => {
    if (!enabled) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [enabled, onClose, ref]);
};
