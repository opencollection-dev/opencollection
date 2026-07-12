import React from 'react';
import type { SplitOrientation } from '../../hooks/useSplitPane';
import { StyledWrapper } from './StyledWrapper';

interface SplitDividerProps {
  orientation?: SplitOrientation;
  onPointerDown: (e: React.PointerEvent) => void;
  testId?: string;
}

export const SplitDivider: React.FC<SplitDividerProps> = ({
  orientation = 'horizontal',
  onPointerDown,
  testId,
}) => (
  <StyledWrapper
    className="split-divider"
    data-orientation={orientation}
    data-testid={testId}
    onPointerDown={onPointerDown}
  />
);

export default SplitDivider;
