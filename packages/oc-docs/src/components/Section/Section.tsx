import React from 'react';
import { SectionLabel } from '../SectionLabel';
import { SectionWrapper } from './StyledWrapper';

interface SectionProps {
  /** Heading shown above the content (rendered through `SectionLabel`). */
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * A labelled content section: a `SectionLabel` heading followed by its content.
 * Owns the spacing between consecutive sections, so callers can stack them
 * without managing margins. Reusable across pages.
 */
export const Section: React.FC<SectionProps> = ({ label, children, className }) => (
  <SectionWrapper className={className}>
    <SectionLabel>{label}</SectionLabel>
    {children}
  </SectionWrapper>
);

export default Section;
