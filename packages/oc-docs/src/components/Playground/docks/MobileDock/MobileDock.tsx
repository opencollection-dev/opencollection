import React from 'react';
import Portal from '../../../../ui/Portal/Portal';
import PlaygroundHeader from '../../PlaygroundHeader/PlaygroundHeader';
import { useLockBodyScroll } from '../../../../hooks';
import type { DockMode } from '../../../../utils/playgroundDock';
import { StyledWrapper } from './StyledWrapper';

interface MobileDockProps {
  dock: DockMode;
  onDockChange: (dock: DockMode) => void;
  onToggleSidebar: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

const MobileDock: React.FC<MobileDockProps> = ({ dock, onDockChange, onToggleSidebar, onClose, children }) => {
  // Full-screen phone presentation: lock the docs scroll behind it. No dock
  // switcher or collapse - there is nowhere to dock on a phone.
  useLockBodyScroll();

  return (
    <Portal>
      <StyledWrapper data-testid="playground-dock-mobile-panel">
        <PlaygroundHeader
          dock={dock}
          onDockChange={onDockChange}
          onToggleSidebar={onToggleSidebar}
          onClose={onClose}
          showDockSwitcher={false}
        />
        <div className="mobile-content" data-testid="playground-content">
          {children}
        </div>
      </StyledWrapper>
    </Portal>
  );
};

export default MobileDock;
