import { useCallback, useEffect, useRef, useState } from 'react';

interface DockResizeOptions {
  axis: 'x' | 'y';
  initial: number;
  min: number;
  /**
   * Upper bound. Pass a getter (e.g. `() => window.innerHeight`) so the bound
   * tracks the live viewport; a plain number is treated as a fixed bound.
   */
  max: number | (() => number);
  /**
   * Which edge of the panel the handle sits on, i.e. which pointer direction
   * grows it. A `trailing` panel (right/bottom dock, handle on its leading
   * edge) grows as the pointer moves back toward the origin; a `leading` panel
   * (left sidebar, handle on its trailing edge) grows as the pointer moves
   * away. Defaults to `trailing` to preserve the docks' behaviour.
   */
  edge?: 'trailing' | 'leading';
  /**
   * Fires when the pointer is dragged past `min` by `collapseThreshold` more
   * pixels (VS Code style): the size sticks at `min` until then, so a user has
   * to deliberately overshoot to collapse. The caller hides the panel. The
   * drag stays live so the same gesture can drag back and re-expand.
   */
  onCollapse?: () => void;
  /**
   * Fires when a collapsed panel is dragged back to at least `min`, within the
   * same still-held drag. The caller re-shows the panel; sizing then resumes.
   */
  onExpand?: () => void;
  /** Extra pixels the pointer must travel past `min` before `onCollapse`. */
  collapseThreshold?: number;
}

interface DockResizeApi {
  size: number;
  dragging: boolean;
  startDrag: (event: React.PointerEvent) => void;
  setSize: (size: number) => void;
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

/**
 * Signed size change for a pointer that moved from `startPos` to `current`
 * along the resize axis. A `trailing` panel (right/bottom dock) grows as the
 * pointer moves back toward the origin; a `leading` panel (left sidebar) grows
 * as it moves away.
 */
export const computeResizeDelta = (
  edge: 'trailing' | 'leading',
  startPos: number,
  current: number
): number => (edge === 'leading' ? current - startPos : startPos - current);

export const useDockResize = ({
  axis,
  initial,
  min,
  max,
  edge = 'trailing',
  onCollapse,
  onExpand,
  collapseThreshold
}: DockResizeOptions): DockResizeApi => {
  // Keep the latest `max` in a ref so callers can pass an inline getter without
  // re-subscribing the resize listener or rebuilding startDrag every render.
  const maxRef = useRef(max);
  maxRef.current = max;
  // Same for the collapse config: callers pass fresh callbacks each render, and
  // reading them from a ref keeps startDrag's identity stable.
  const collapseRef = useRef({ onCollapse, onExpand, collapseThreshold });
  collapseRef.current = { onCollapse, onExpand, collapseThreshold };
  const resolveMax = useCallback(() => {
    const m = maxRef.current;
    return typeof m === 'function' ? m() : m;
  }, []);
  const [size, setSize] = useState<number>(() => clamp(initial, min, resolveMax()));
  const [dragging, setDragging] = useState<boolean>(false);
  // Teardown for the in-flight drag, so it can be cancelled on unmount.
  const endDragRef = useRef<null | (() => void)>(null);

  const startDrag = useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault();
      const handle = event.currentTarget as HTMLElement;
      const pointerId = event.pointerId;
      const startPos = axis === 'x' ? event.clientX : event.clientY;
      const startSize = size;
      // Capture keeps events flowing while the pointer leaves the viewport (OS
      // chrome / second monitor). They still bubble to the window listeners
      // below; when the handle unmounts on collapse the capture auto-releases
      // and the window listeners keep the drag alive.
      handle.setPointerCapture?.(pointerId);
      // Hold the resize cursor for the whole gesture and block text selection.
      // The handle's own cursor would otherwise flip back to default the moment
      // it unmounts on collapse, even while the pointer is still down.
      const resizeCursor = axis === 'x' ? 'col-resize' : 'row-resize';
      const prevCursor = document.body.style.cursor;
      const prevUserSelect = document.body.style.userSelect;
      document.body.style.cursor = resizeCursor;
      document.body.style.userSelect = 'none';
      // Once past the min by the threshold the panel collapses, then can be
      // dragged back open in the same gesture: `collapsed` tracks that state so
      // collapse/expand each fire once per crossing. The point the two toggle
      // around is `min`, so re-expanding snaps straight to the min width.
      let collapsed = false;
      setDragging(true);

      const onMove = (moveEvent: PointerEvent) => {
        const current = axis === 'x' ? moveEvent.clientX : moveEvent.clientY;
        const intended = startSize + computeResizeDelta(edge, startPos, current);
        const { onCollapse: collapse, onExpand: expand, collapseThreshold: threshold } = collapseRef.current;
        if (collapse != null && threshold != null && !collapsed && intended < min - threshold) {
          collapsed = true;
          setSize(min);
          collapse();
          return;
        }
        if (collapsed) {
          // Stay collapsed until the pointer climbs back to the min, then
          // re-show the panel and resume sizing from there (same gesture).
          if (intended >= min) {
            collapsed = false;
            expand?.();
            setSize(clamp(intended, min, resolveMax()));
          }
          return;
        }
        setSize(clamp(intended, min, resolveMax()));
      };
      // Listen on `window` (not the handle) so the drag survives the handle
      // unmounting when the panel collapses mid-gesture; move/up keep firing
      // until the real pointer release.
      const end = () => {
        setDragging(false);
        document.body.style.cursor = prevCursor;
        document.body.style.userSelect = prevUserSelect;
        // The handle may already be detached (collapsed panel), which releases
        // the capture on its own and makes an explicit release throw.
        if (handle.hasPointerCapture?.(pointerId)) handle.releasePointerCapture(pointerId);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', end);
        window.removeEventListener('pointercancel', end);
        endDragRef.current = null;
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', end);
      window.addEventListener('pointercancel', end);
      endDragRef.current = end;
    },
    [axis, size, min, resolveMax, edge]
  );

  // Re-clamp to the live bound when the viewport changes, so a mid-session
  // window resize (or rotation) can't leave the dock larger than the viewport.
  useEffect(() => {
    const onResize = () => setSize((prev) => clamp(prev, min, resolveMax()));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [min, resolveMax]);

  // Cancel an in-flight drag if the dock unmounts, so listeners never outlive
  // the element and no state update fires after unmount.
  useEffect(() => () => endDragRef.current?.(), []);

  return { size, dragging, startDrag, setSize };
};
