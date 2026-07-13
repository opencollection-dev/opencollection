import React from 'react';
import IconButton from '@ui/IconButton/IconButton';
import { DockInlineIcon, DockBottomIcon, DockModalIcon } from '../../../assets/icons';
import type { DockMode } from '@utils/playgroundDock';
import { StyledWrapper } from './StyledWrapper';

const DOCKS: { mode: DockMode; label: string; Icon: React.FC }[] = [
  { mode: 'inline', label: 'Dock to the right', Icon: DockInlineIcon },
  { mode: 'bottom', label: 'Dock to the bottom', Icon: DockBottomIcon },
  { mode: 'modal', label: 'Open as window', Icon: DockModalIcon },
];

interface DockSwitcherProps {
  dock: DockMode;
  onDockChange: (dock: DockMode) => void;
  testId?: string;
}

const DockSwitcher: React.FC<DockSwitcherProps> = ({
  dock,
  onDockChange,
  testId = 'playground-dock-switcher',
}) => (
  <StyledWrapper data-testid={testId}>
    {DOCKS.map(({ mode, label, Icon }) => (
      <IconButton
        key={mode}
        label={label}
        title={label}
        aria-pressed={dock === mode}
        className={dock === mode ? 'active' : ''}
        data-testid={`playground-dock-${mode}`}
        onClick={() => onDockChange(mode)}
      >
        <Icon />
      </IconButton>
    ))}
  </StyledWrapper>
);

export default DockSwitcher;
