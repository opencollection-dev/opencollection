import React from 'react';
import type { Environment } from '@opencollection/types/config/environments';
import { EnvironmentSummaryItemWrapper } from './StyledWrapper';

/** Human-readable variable count, e.g. "1 variable" / "5 variables". */
const formatVariableCount = (count: number): string => `${count} variable${count === 1 ? '' : 's'}`;

interface EnvironmentSummaryItemProps {
  environment: Environment;
}

/** A single environment row: color dot, name, and variable count. Renders an `<li>`. */
export const EnvironmentSummaryItem: React.FC<EnvironmentSummaryItemProps> = ({ environment }) => (
  <EnvironmentSummaryItemWrapper className="environment-summary-item">
    <span
      className="environment-summary-dot"
      style={environment.color ? { background: environment.color } : undefined}
    />
    <span className="environment-summary-name">{environment.name}</span>
    <span className="environment-summary-spacer" />
    <span className="environment-summary-vars">{formatVariableCount(environment.variables?.length ?? 0)}</span>
  </EnvironmentSummaryItemWrapper>
);

export default EnvironmentSummaryItem;
