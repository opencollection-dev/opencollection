import React from 'react';
import type { Environment } from '@opencollection/types/config/environments';
import { EnvironmentSummaryItem } from '@components/OverviewEnvironments/EnvironmentSummaryItem/EnvironmentSummaryItem';
import { StyledWrapper } from './StyledWrapper';

interface EnvironmentSummaryProps {
  environments: Environment[];
  testId?: string;
  itemTestId?: string;
}

export const EnvironmentSummary: React.FC<EnvironmentSummaryProps> = ({ environments, testId = 'environment-summary', itemTestId }) => {
  if (!environments.length) {
    return null;
  }

  return (
    <StyledWrapper className="environment-summary" data-testid={testId}>
      {environments.map((environment, index) => (
        <EnvironmentSummaryItem key={`${environment.name}-${index}`} environment={environment} testId={itemTestId} />
      ))}
    </StyledWrapper>
  );
};

export default EnvironmentSummary;
