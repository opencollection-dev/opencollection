import React from 'react';
import { StyledWrapper } from './StyledWrapper';

export const DisabledBadge: React.FC = () => (
  <StyledWrapper className="disabled-badge" data-testid="disabled-badge">Disabled</StyledWrapper>
);

export default DisabledBadge;
