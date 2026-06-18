import React from 'react';
import type { Environment } from '@opencollection/types/config/environments';
import { EnvironmentSummaryItemWrapper } from './StyledWrapper';

/** Human-readable variable count, e.g. "1 variable" / "5 variables". */
const formatVariableCount = (count: number): string => `${count} variable${count === 1 ? '' : 's'}`;

interface EnvironmentSummaryItemProps {
  environment: Environment;
  /** Test hook (`data-testid`); the variable-count cell gets `${testId}-vars`. */
  testId?: string;
}

/** A single environment row: color dot, name, and variable count. Renders an `<li>`. */
export const EnvironmentSummaryItem: React.FC<EnvironmentSummaryItemProps> = ({ environment, testId }) => (
  <EnvironmentSummaryItemWrapper className="environment-summary-item" data-testid={testId}>
    <span
      className="environment-summary-dot"
      style={environment.color ? { background: environment.color } : undefined}
    />
    <span className="environment-summary-name">{environment.name}</span>
    <span className="environment-summary-spacer" />
    <span className="environment-summary-vars" data-testid={testId ? `${testId}-vars` : undefined}>
      {formatVariableCount(environment.variables?.length ?? 0)}
    </span>
  </EnvironmentSummaryItemWrapper>
);

export default EnvironmentSummaryItem;
