import React, { useEffect, useRef } from 'react';
import PlaygroundHeader from '../../PlaygroundHeader/PlaygroundHeader';
import { useDockResize } from '../../../../hooks/useDockResize';
import type { DockMode } from '../../../../utils/playgroundDock';
import { StyledWrapper } from './StyledWrapper';

const HEADER_HEIGHT = 52;
// Treat a drag-down to (roughly) the header height as collapsed, so dragging the
// sheet down to the header behaves like the collapse button.
const COLLAPSE_EPSILON = 8;

interface BottomSheetDockProps {
  dock: DockMode;
  onDockChange: (dock: DockMode) => void;
  onToggleSidebar: () => void;
  onClose: () => void;
  /** Bumped on each Try click; re-expands the sheet when it is collapsed. */
  openNonce?: number;
  children: React.ReactNode;
}

const BottomSheetDock: React.FC<BottomSheetDockProps> = ({
  dock,
  onDockChange,
  onToggleSidebar,
  onClose,
  openNonce,
  children,
}) => {
  // Opens to 75% of the viewport by default (and re-expands to it from collapsed),
  // and can be dragged up to full screen or down to collapse.
  const defaultHeight = Math.round(window.innerHeight * 0.75);
  const { size, dragging, startDrag, setSize } = useDockResize({
    axis: 'y',
    initial: defaultHeight,
    min: HEADER_HEIGHT,
    max: () => window.innerHeight,
  });
  // Height drives everything: dragging down to the header collapses it, and the
  // collapse button just snaps between the header height and the last size.
  const lastExpanded = useRef<number>(defaultHeight);
  const collapsed = size <= HEADER_HEIGHT + COLLAPSE_EPSILON;

  // A Try click re-opens the playground; if the sheet is currently collapsed,
  // expand it back to the default height. Read size/target through refs so this
  // fires only on the Try signal, not when the user collapses it themselves.
  const sizeRef = useRef(size);
  sizeRef.current = size;
  const defaultHeightRef = useRef(defaultHeight);
  defaultHeightRef.current = defaultHeight;
  useEffect(() => {
    if (openNonce === undefined) return;
    if (sizeRef.current <= HEADER_HEIGHT + COLLAPSE_EPSILON) setSize(defaultHeightRef.current);
  }, [openNonce, setSize]);

  const toggleCollapse = () => {
    if (collapsed) {
      setSize(lastExpanded.current > HEADER_HEIGHT + COLLAPSE_EPSILON ? lastExpanded.current : defaultHeight);
    } else {
      lastExpanded.current = size;
      setSize(HEADER_HEIGHT);
    }
  };

  return (
    <StyledWrapper
      style={{ height: `${size}px` }}
      className={dragging ? 'dragging' : ''}
      data-testid="playground-dock-bottom-panel"
    >
      <div className="resize-handle" role="separator" aria-orientation="horizontal" onPointerDown={startDrag} />
      <PlaygroundHeader
        dock={dock}
        onDockChange={onDockChange}
        onToggleSidebar={onToggleSidebar}
        onClose={onClose}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
      />
      {!collapsed && (
        <div className="dock-content" data-testid="playground-content">
          {children}
        </div>
      )}
    </StyledWrapper>
  );
};

export default BottomSheetDock;
