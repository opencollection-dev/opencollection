import React from 'react';
import type { SplitOrientation } from '../../hooks/useSplitPane';
import { StyledWrapper } from './StyledWrapper';

interface SplitDividerProps {
  orientation?: SplitOrientation;
  onPointerDown: (e: React.PointerEvent) => void;
  active?: boolean;
  testId?: string;
}

export const SplitDivider: React.FC<SplitDividerProps> = ({
  orientation = 'horizontal',
  onPointerDown,
  active = false,
  testId,
}) => (
  <StyledWrapper
    className="split-divider"
    data-orientation={orientation}
    data-active={active}
    data-testid={testId}
    onPointerDown={onPointerDown}
  />
);

export default SplitDivider;
