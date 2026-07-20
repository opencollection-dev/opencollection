import React from 'react';
import IconButton from '../../../ui/IconButton/IconButton';
import { BrunoGlyph, SidebarToggleIcon, CloseIcon, ChevronDownIcon } from '../../../assets/icons';
import DockSwitcher from '../DockSwitcher/DockSwitcher';
import type { DockMode } from '../../../utils/playgroundDock';
import { StyledWrapper } from './StyledWrapper';

interface PlaygroundHeaderProps {
  dock: DockMode;
  onDockChange: (dock: DockMode) => void;
  showDockSwitcher?: boolean;
  onToggleSidebar: () => void;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  testId?: string;
}

const PlaygroundHeader: React.FC<PlaygroundHeaderProps> = ({
  dock,
  onDockChange,
  showDockSwitcher = true,
  onToggleSidebar,
  onClose,
  collapsed,
  onToggleCollapse,
  testId = 'playground-header',
}) => (
  <StyledWrapper data-testid={testId}>
    <div className="header-left">
      <IconButton
        className="header-sidebar-toggle"
        label="Toggle playground sidebar"
        title="Toggle sidebar"
        data-testid="playground-sidebar-toggle"
        onClick={onToggleSidebar}
      >
        <SidebarToggleIcon />
      </IconButton>
      <span className="header-brand">
        <BrunoGlyph />
        <span className="header-title">Bruno Playground</span>
      </span>
    </div>
    <div className="header-right">
      {showDockSwitcher && <DockSwitcher dock={dock} onDockChange={onDockChange} />}
      {onToggleCollapse && (
        <IconButton
          className={`header-collapse${collapsed ? ' collapsed' : ''}`}
          label={collapsed ? 'Expand playground' : 'Collapse playground'}
          title={collapsed ? 'Expand' : 'Collapse'}
          data-testid="playground-collapse"
          onClick={onToggleCollapse}
        >
          <ChevronDownIcon />
        </IconButton>
      )}
      <IconButton className="header-close" label="Close playground" title="Close" data-testid="playground-close" onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </div>
  </StyledWrapper>
);

export default PlaygroundHeader;
