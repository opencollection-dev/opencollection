import { useEffect } from 'react';

// Module-level refcount so overlapping lockers (e.g. a modal over the drawer)
// don't fight over body.overflow: the first lock saves + hides, the last
// release restores, regardless of unmount order.
let lockCount = 0;
let previousOverflow = '';

/**
 * Locks body scroll while `active` (e.g. an overlay is open) and restores it
 * once every locker has released. Shared by the drawer and modal.
 */
export const useLockBodyScroll = (active = true): void => {
  useEffect(() => {
    if (!active) return;
    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    lockCount += 1;
    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow;
      }
    };
  }, [active]);
};
