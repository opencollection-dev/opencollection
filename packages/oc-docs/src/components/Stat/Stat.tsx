import React from 'react';
import { StatWrapper } from './StyledWrapper';

export interface StatItem {
  label: string;
  value: number | string;
}

/** A single labelled stat — a large value with a caption below. Reusable anywhere. */
export const Stat: React.FC<StatItem> = ({ label, value }) => (
  <StatWrapper className="stat">
    <span className="stat-value">{value}</span>
    <span className="stat-label">{label}</span>
  </StatWrapper>
);

export default Stat;
