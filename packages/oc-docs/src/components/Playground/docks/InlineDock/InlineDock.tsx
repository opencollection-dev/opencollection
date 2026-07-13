import React from 'react';
import PlaygroundHeader from '@components/Playground/PlaygroundHeader/PlaygroundHeader';
import { useDockResize } from '@hooks/useDockResize';
import type { DockMode } from '@utils/playgroundDock';
import { StyledWrapper } from './StyledWrapper';

interface InlineDockProps {
  dock: DockMode;
  onDockChange: (dock: DockMode) => void;
  onToggleSidebar: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

const InlineDock: React.FC<InlineDockProps> = ({ dock, onDockChange, onToggleSidebar, onClose, children }) => {
  const { size, dragging, startDrag } = useDockResize({
    axis: 'x',
    initial: Math.round(window.innerWidth * 0.4),
    min: 360,
    max: () => Math.round(window.innerWidth * 0.7),
  });

  return (
    <StyledWrapper
      style={{ width: `${size}px` }}
      className={dragging ? 'dragging' : ''}
      data-testid="playground-dock-inline-panel"
    >
      <div className="resize-handle" role="separator" aria-orientation="vertical" onPointerDown={startDrag} />
      <div className="dock-body">
        <PlaygroundHeader
          dock={dock}
          onDockChange={onDockChange}
          onToggleSidebar={onToggleSidebar}
          onClose={onClose}
        />
        <div className="dock-content" data-testid="playground-content">
          {children}
        </div>
      </div>
    </StyledWrapper>
  );
};

export default InlineDock;
