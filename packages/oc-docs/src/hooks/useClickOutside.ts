import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Calls `onClose` on a mousedown outside `ref` while `enabled`. Shared by the
 * search panel and the filter dropdowns so the close-on-outside-click behaviour
 * lives in one place.
 */
export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  enabled = true,
): void => {
  useEffect(() => {
    if (!enabled) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [enabled, onClose, ref]);
};
