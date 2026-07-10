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
}

interface DockResizeApi {
  size: number;
  dragging: boolean;
  startDrag: (event: React.PointerEvent) => void;
  setSize: (size: number) => void;
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export const useDockResize = ({ axis, initial, min, max }: DockResizeOptions): DockResizeApi => {
  // Keep the latest `max` in a ref so callers can pass an inline getter without
  // re-subscribing the resize listener or rebuilding startDrag every render.
  const maxRef = useRef(max);
  maxRef.current = max;
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
      // Pointer capture routes move/up to the handle even when the pointer
      // leaves the viewport (OS chrome / second monitor), so the drag can't run
      // away when the release happens off-window.
      handle.setPointerCapture?.(pointerId);
      setDragging(true);

      const onMove = (moveEvent: PointerEvent) => {
        const current = axis === 'x' ? moveEvent.clientX : moveEvent.clientY;
        const delta = startPos - current;
        setSize(clamp(startSize + delta, min, resolveMax()));
      };
      const end = () => {
        setDragging(false);
        handle.releasePointerCapture?.(pointerId);
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', end);
        handle.removeEventListener('pointercancel', end);
        endDragRef.current = null;
      };
      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', end);
      handle.addEventListener('pointercancel', end);
      endDragRef.current = end;
    },
    [axis, size, min, resolveMax]
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
