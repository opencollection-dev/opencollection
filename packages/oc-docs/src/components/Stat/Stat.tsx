import React from 'react';
import { StatWrapper } from './StyledWrapper';

export interface StatItem {
  label: string;
  value: number | string;
}

interface StatProps extends StatItem {
  /** Test hook (`data-testid`); the value cell gets `${testId}-value`. */
  testId?: string;
}

/** A single labelled stat — a large value with a caption below. Reusable anywhere. */
export const Stat: React.FC<StatProps> = ({ label, value, testId }) => (
  <StatWrapper className="stat" data-testid={testId}>
    <span className="stat-value" data-testid={testId ? `${testId}-value` : undefined}>{value}</span>
    <span className="stat-label">{label}</span>
  </StatWrapper>
);

export default Stat;
