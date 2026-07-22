import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Calls `onClose` on a pointerdown outside `ref` while `enabled`. Uses
 * pointerdown (not mousedown) so it fires uniformly for mouse, touch and pen;
 * on touch, mousedown is only a compatibility event and can be suppressed.
 * Shared by the search panel and the filter dropdowns so the close-on-outside
 * behaviour lives in one place. Pass `ignoreSelector` to keep a trigger that
 * lives outside `ref` (e.g. a separate toggle button) from counting as outside,
 * which would otherwise close then immediately reopen on the trigger's click.
 */
export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  enabled = true,
  ignoreSelector?: string,
): void => {
  useEffect(() => {
    if (!enabled) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (ref.current?.contains(target)) return;
      if (ignoreSelector && target?.closest(ignoreSelector)) return;
      onClose();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [enabled, onClose, ref, ignoreSelector]);
};
