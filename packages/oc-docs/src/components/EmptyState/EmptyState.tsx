import React from 'react';
import { EmptyStateWrapper } from './StyledWrapper';

interface EmptyStateProps {
  /** Icon shown in the circular badge (decorative — hidden from assistive tech). */
  icon: React.ReactNode;
  /** Bold primary message, e.g. "No environments yet". */
  heading: React.ReactNode;
  /** Supporting description shown beneath the heading. */
  subheading: React.ReactNode;
  /** Test hook (`data-testid`); the heading gets `${testId}-heading`. */
  testId?: string;
  className?: string;
}

/**
 * Placeholder shown when a section has no content. Renders a dashed card with a
 * circular icon badge, a heading and a subheading. Icon-agnostic and fully
 * prop-driven, so it can be reused for any empty section across pages.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ icon, heading, subheading, testId, className }) => (
  <EmptyStateWrapper className={className} data-testid={testId}>
    <span className="empty-state-icon" aria-hidden="true">
      {icon}
    </span>
    <p className="empty-state-heading" data-testid={testId ? `${testId}-heading` : undefined}>{heading}</p>
    <p className="empty-state-subheading">{subheading}</p>
  </EmptyStateWrapper>
);

export default EmptyState;
