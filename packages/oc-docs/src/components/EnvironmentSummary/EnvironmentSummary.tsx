import React from 'react';
import type { Environment } from '@opencollection/types/config/environments';
import { EnvironmentSummaryItem } from '../EnvironmentSummaryItem';
import { EnvironmentSummaryWrapper } from './StyledWrapper';

interface EnvironmentSummaryProps {
  environments: Environment[];
}

/** Read-only list of a collection's environments, composed from `EnvironmentSummaryItem`. */
export const EnvironmentSummary: React.FC<EnvironmentSummaryProps> = ({ environments }) => {
  if (!environments.length) {
    return null;
  }

  return (
    <EnvironmentSummaryWrapper className="environment-summary">
      {environments.map((environment, index) => (
        <EnvironmentSummaryItem key={`${environment.name}-${index}`} environment={environment} />
      ))}
    </EnvironmentSummaryWrapper>
  );
};

export default EnvironmentSummary;
