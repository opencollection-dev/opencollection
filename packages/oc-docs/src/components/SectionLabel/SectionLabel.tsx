import React from 'react';
import { StyledWrapper } from './StyledWrapper';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface SectionLabelProps {
  children: React.ReactNode;
  as?: HeadingLevel;
  testId?: string;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ children, as = 'h2', testId, className }) => (
  <StyledWrapper as={as} className={className} data-testid={testId}>
    {children}
  </StyledWrapper>
);

export default SectionLabel;
