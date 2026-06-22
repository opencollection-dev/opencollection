import React from 'react';
import type { Environment } from '@opencollection/types/config/environments';
import { EnvironmentSummaryItem } from '../EnvironmentSummaryItem/EnvironmentSummaryItem';
import { EnvironmentSummaryWrapper } from './StyledWrapper';

interface EnvironmentSummaryProps {
  environments: Environment[];
  /** Test hook (`data-testid`) for the list container. */
  testId?: string;
  /** Test hook applied to every item (its var-count cell gets `${itemTestId}-vars`). */
  itemTestId?: string;
}

/** Read-only list of a collection's environments, composed from `EnvironmentSummaryItem`. */
export const EnvironmentSummary: React.FC<EnvironmentSummaryProps> = ({ environments, testId, itemTestId }) => {
  if (!environments.length) {
    return null;
  }

  return (
    <EnvironmentSummaryWrapper className="environment-summary" data-testid={testId}>
      {environments.map((environment, index) => (
        <EnvironmentSummaryItem key={`${environment.name}-${index}`} environment={environment} testId={itemTestId} />
      ))}
    </EnvironmentSummaryWrapper>
  );
};

export default EnvironmentSummary;
