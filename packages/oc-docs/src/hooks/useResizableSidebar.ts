import { useEffect, useMemo } from 'react';
import { useDockResize } from './useDockResize';
import { areaFor, readStored, writeStored } from './useStorage';

export const SIDEBAR_MIN_WIDTH = 200;
export const SIDEBAR_MAX_WIDTH = 480;
export const SIDEBAR_DEFAULT_WIDTH = 260;
// Extra drag past the min before the sidebar collapses (VS Code feel): the
// width sticks at the min until the pointer overshoots by this much.
export const SIDEBAR_COLLAPSE_THRESHOLD = 100;

interface ResizableSidebarApi {
  width: number;
  dragging: boolean;
  startDrag: (event: React.PointerEvent) => void;
}

/**
 * Width state for a left-docked sidebar the user can drag-resize. Backs the
 * drag with useDockResize (leading edge, so dragging right grows it) and
 * persists the settled width to sessionStorage under `storageKey`: a reload
 * restores it, closing the tab clears it (product wanted per-session, not
 * permanent). Seeded from any stored value, clamped by useDockResize. Passing
 * `onCollapse`/`onExpand` enables VS Code-style overshoot-to-collapse at the
 * min width, with re-expand in the same drag.
 */
export const useResizableSidebar = (
  storageKey: string,
  onCollapse?: () => void,
  onExpand?: () => void
): ResizableSidebarApi => {
  // Read the stored width once (not on every render, which during a drag would
  // be a sessionStorage read + parse per pointer move); useDockResize seeds its
  // state from it lazily.
  const initialWidth = useMemo(
    () => readStored(areaFor('session'), storageKey, SIDEBAR_DEFAULT_WIDTH),
    [storageKey]
  );
  const { size, dragging, startDrag } = useDockResize({
    axis: 'x',
    edge: 'leading',
    initial: initialWidth,
    min: SIDEBAR_MIN_WIDTH,
    max: SIDEBAR_MAX_WIDTH,
    onCollapse,
    onExpand,
    collapseThreshold: SIDEBAR_COLLAPSE_THRESHOLD
  });

  // Persist once the drag settles (and on any re-clamp), so the width survives a
  // reload within the session without writing on every pointer move.
  useEffect(() => {
    if (!dragging) writeStored(areaFor('session'), storageKey, size);
  }, [dragging, size, storageKey]);

  return { width: size, dragging, startDrag };
};
