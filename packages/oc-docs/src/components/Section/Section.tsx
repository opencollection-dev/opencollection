import React from 'react';
import { SectionLabel } from '../SectionLabel';
import { SectionWrapper } from './StyledWrapper';

interface SectionProps {
  /** Heading shown above the content (rendered through `SectionLabel`). */
  label: React.ReactNode;
  children: React.ReactNode;
  /** Test hook (`data-testid`) applied to the section's label heading. */
  testId?: string;
  className?: string;
}

/**
 * A labelled content section: a `SectionLabel` heading followed by its content.
 * Owns the spacing between consecutive sections, so callers can stack them
 * without managing margins. Reusable across pages.
 */
export const Section: React.FC<SectionProps> = ({ label, children, testId, className }) => (
  <SectionWrapper className={className}>
    <SectionLabel testId={testId}>{label}</SectionLabel>
    {children}
  </SectionWrapper>
);

export default Section;
