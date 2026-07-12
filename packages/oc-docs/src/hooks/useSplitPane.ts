import { useCallback, useEffect, useRef, useState } from 'react';

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export type SplitOrientation = 'horizontal' | 'vertical';

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const computeSplitPercent = (
  rect: Rect,
  clientX: number,
  clientY: number,
  orientation: SplitOrientation
): number => {
  const raw =
    orientation === 'vertical'
      ? ((clientY - rect.top) / rect.height) * 100
      : ((clientX - rect.left) / rect.width) * 100;
  return clamp(raw, 20, 80);
};

export const useSplitPane = (orientation: SplitOrientation = 'horizontal', initialSize = 50) => {
  const sizesRef = useRef<Record<SplitOrientation, number>>({ horizontal: initialSize, vertical: initialSize });
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const endRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    setSize(sizesRef.current[orientation]);
  }, [orientation]);

  const startResize = useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault();
      const handle = event.currentTarget as HTMLElement;
      const pointerId = event.pointerId;
      handle.setPointerCapture?.(pointerId);
      setIsResizing(true);

      const onMove = (moveEvent: PointerEvent) => {
        const el = containerRef.current;
        if (!el) return;
        const percent = computeSplitPercent(el.getBoundingClientRect(), moveEvent.clientX, moveEvent.clientY, orientation);
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          sizesRef.current[orientation] = percent;
          setSize(percent);
        });
      };
      const end = () => {
        setIsResizing(false);
        cancelAnimationFrame(rafRef.current);
        handle.releasePointerCapture?.(pointerId);
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', end);
        handle.removeEventListener('pointercancel', end);
        endRef.current = null;
      };
      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', end);
      handle.addEventListener('pointercancel', end);
      endRef.current = end;
    },
    [orientation]
  );

  useEffect(
    () => () => {
      endRef.current?.();
      cancelAnimationFrame(rafRef.current);
    },
    []
  );

  return { size, isResizing, containerRef, startResize };
};
