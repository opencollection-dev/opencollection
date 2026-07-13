import React from 'react';
import Portal from '@ui/Portal/Portal';
import PlaygroundHeader from '@components/Playground/PlaygroundHeader/PlaygroundHeader';
import { useEscapeKey, useLockBodyScroll } from '@hooks';
import type { DockMode } from '@utils/playgroundDock';
import { StyledWrapper } from './StyledWrapper';

interface ModalDockProps {
  dock: DockMode;
  onDockChange: (dock: DockMode) => void;
  onToggleSidebar: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalDock: React.FC<ModalDockProps> = ({ dock, onDockChange, onToggleSidebar, onClose, children }) => {
  // Modal is a true full-screen overlay: lock the docs body scroll behind it and
  // close on Escape (the inline/bottom docks are persistent panels, so they get
  // neither). Focus containment / focus-return is a tracked follow-up.
  useLockBodyScroll();
  useEscapeKey(onClose);

  return (
    <Portal>
      <StyledWrapper data-testid="playground-dock-modal-panel">
        <div className="modal-backdrop" onClick={onClose} />
        <div className="modal-window" role="dialog" aria-modal="true" aria-label="Bruno Playground">
          <PlaygroundHeader
            dock={dock}
            onDockChange={onDockChange}
            onToggleSidebar={onToggleSidebar}
            onClose={onClose}
          />
          <div className="modal-content" data-testid="playground-content">
            {children}
          </div>
        </div>
      </StyledWrapper>
    </Portal>
  );
};

export default ModalDock;
