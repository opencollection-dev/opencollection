import React from 'react';
import { StyledWrapper } from './StyledWrapper';

interface SplitDividerProps {
  /** Layout axis of the two panes. `horizontal` renders a vertical drag bar. */
  orientation?: 'horizontal' | 'vertical';
  onMouseDown: (e: React.MouseEvent) => void;
  testId?: string;
}

export const SplitDivider: React.FC<SplitDividerProps> = ({
  orientation = 'horizontal',
  onMouseDown,
  testId,
}) => (
  <StyledWrapper
    className="split-divider"
    data-orientation={orientation}
    data-testid={testId}
    onMouseDown={onMouseDown}
  />
);

export default SplitDivider;
