import React from 'react';
import type { Environment } from '@opencollection/types/config/environments';
import { EnvironmentLabel } from '../../EnvironmentLabel/EnvironmentLabel';
import { StyledWrapper } from './StyledWrapper';

const formatVariableCount = (count: number): string => `${count} variable${count === 1 ? '' : 's'}`;

interface EnvironmentSummaryItemProps {
  environment: Environment;
  testId?: string;
}

/** A single environment row: color dot, name, and variable count. Renders an `<li>`. */
export const EnvironmentSummaryItem: React.FC<EnvironmentSummaryItemProps> = ({ environment, testId = 'environment-summary-item' }) => (
  <StyledWrapper className="environment-summary-item" data-testid={testId}>
    <EnvironmentLabel name={environment.name} color={environment.color} className="environment-summary-label" />
    <span className="environment-summary-spacer" />
    <span className="environment-summary-vars" data-testid={testId ? `${testId}-variable-count` : undefined}>
      {formatVariableCount(environment.variables?.length ?? 0)}
    </span>
  </StyledWrapper>
);

export default EnvironmentSummaryItem;
