import React from 'react';
import { SubHeadingWrapper } from './StyledWrapper';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface SubHeadingProps {
  children: React.ReactNode;
  /** Semantic heading element to render (the visual style is the same). Defaults to "h3". */
  as?: HeadingLevel;
  /** Test hook (`data-testid`); set by the composition root. */
  testId?: string;
  className?: string;
}

/**
 * Reusable sub-heading with the shared group-title typography
 * (Inter, Semi Bold 600, 13px, 12px line-height, 0 letter-spacing).
 * Use `as` to render the correct heading level for the document outline.
 */
export const SubHeading: React.FC<SubHeadingProps> = ({ children, as = 'h3', testId, className }) => (
  <SubHeadingWrapper as={as} className={className} data-testid={testId}>
    {children}
  </SubHeadingWrapper>
);

export default SubHeading;
