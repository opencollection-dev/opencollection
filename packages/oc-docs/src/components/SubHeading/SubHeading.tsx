import React from 'react';
import { SubHeadingWrapper } from './StyledWrapper';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface SubHeadingProps {
  children: React.ReactNode;
  as?: HeadingLevel;
  testId?: string;
  className?: string;
}

export const SubHeading: React.FC<SubHeadingProps> = ({ children, as = 'h3', testId, className }) => (
  <SubHeadingWrapper as={as} className={className} data-testid={testId}>
    {children}
  </SubHeadingWrapper>
);

export default SubHeading;
