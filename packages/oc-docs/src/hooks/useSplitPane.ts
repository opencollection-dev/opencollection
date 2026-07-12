import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Drives a two-pane split with one draggable divider. The divider resizes the
 * first pane along the layout axis: horizontal layout drags width, vertical
 * layout drags height. The ratio is clamped to 20-80% so neither pane collapses.
 *
 * Shared by the live playground request/response splitter and the read-only
 * example view, so both drag identically.
 *
 * `size` is the first pane's percentage. Attach `containerRef` to the flex row
 * that holds both panes, drive the first pane's width/height from `size`, and
 * wire `startResize` to the divider's onMouseDown. `isResizing` is true while a
 * drag is in progress (use it to suppress text selection).
 */
export const useSplitPane = (
  orientation: 'horizontal' | 'vertical' = 'horizontal',
  initialSize = 50
) => {
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startResize = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const percent =
        orientation === 'vertical'
          ? ((e.clientY - rect.top) / rect.height) * 100
          : ((e.clientX - rect.left) / rect.width) * 100;
      if (percent < 20 || percent > 80) return;
      setSize(percent);
    };
    const onUp = () => setIsResizing(false);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [isResizing, orientation]);

  return { size, isResizing, containerRef, startResize };
};
