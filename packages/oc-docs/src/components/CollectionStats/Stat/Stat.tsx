import React from 'react';
import { StyledWrapper } from './StyledWrapper';

export interface StatItem {
  label: string;
  value: number | string;
}

interface StatProps extends StatItem {
  testId?: string;
}

export const Stat: React.FC<StatProps> = ({ label, value, testId }) => (
  <StyledWrapper className="stat" data-testid={testId}>
    <span className="stat-value" data-testid={testId ? `${testId}-value` : undefined}>{value}</span>
    <span className="stat-label">{label}</span>
  </StyledWrapper>
);

export default Stat;
