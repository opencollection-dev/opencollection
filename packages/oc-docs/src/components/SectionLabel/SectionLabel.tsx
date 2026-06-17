import React from 'react';
import { SectionLabelWrapper } from './StyledWrapper';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface SectionLabelProps {
  children: React.ReactNode;
  /** Semantic heading element to render (the visual style is the same). Defaults to "h2". */
  as?: HeadingLevel;
  className?: string;
}

/**
 * Reusable uppercase section label with the shared label typography
 * (Inter, Semi Bold 600, 11px, 100% line-height, 1.4px letter-spacing).
 * Use `as` to render the correct heading level for the document outline.
 */
export const SectionLabel: React.FC<SectionLabelProps> = ({ children, as = 'h2', className }) => (
  <SectionLabelWrapper as={as} className={className}>
    {children}
  </SectionLabelWrapper>
);

export default SectionLabel;
