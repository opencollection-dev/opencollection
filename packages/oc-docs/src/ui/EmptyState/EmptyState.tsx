import React from 'react';
import { StyledWrapper } from './StyledWrapper';

interface EmptyStateProps {
  icon: React.ReactNode;
  heading: React.ReactNode;
  subheading: React.ReactNode;
  testId?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, heading, subheading, testId = 'empty-state', className }) => (
  <StyledWrapper className={className} data-testid={testId}>
    <span className="empty-state-icon" aria-hidden="true">
      {icon}
    </span>
    <p className="empty-state-heading" data-testid={testId ? `${testId}-heading` : undefined}>{heading}</p>
    <p className="empty-state-subheading">{subheading}</p>
  </StyledWrapper>
);

export default EmptyState;
