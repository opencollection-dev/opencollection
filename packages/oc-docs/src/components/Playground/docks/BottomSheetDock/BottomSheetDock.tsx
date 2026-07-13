import React, { useRef } from 'react';
import PlaygroundHeader from '@components/Playground/PlaygroundHeader/PlaygroundHeader';
import { useDockResize } from '@hooks/useDockResize';
import type { DockMode } from '@utils/playgroundDock';
import { StyledWrapper } from './StyledWrapper';

const HEADER_HEIGHT = 52;
// Treat a drag-down to (roughly) the header height as collapsed, so dragging the
// sheet down to the header behaves like the collapse button.
const COLLAPSE_EPSILON = 8;
// The docs topbar height. The sheet opens up to the topbar's bottom line so the
// topbar stays visible; the topbar's own border is hidden while it is open
// (see AppShell) so the seam reads as a single line.
const TOPBAR_OFFSET = 52;

interface BottomSheetDockProps {
  dock: DockMode;
  onDockChange: (dock: DockMode) => void;
  onToggleSidebar: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

const BottomSheetDock: React.FC<BottomSheetDockProps> = ({
  dock,
  onDockChange,
  onToggleSidebar,
  onClose,
  children,
}) => {
  // Opens below the topbar by default (topbar stays visible), but can be dragged
  // up to full screen or down to collapse.
  const defaultHeight = window.innerHeight - TOPBAR_OFFSET;
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
