import React from 'react';
import { HeadingWrapper } from './StyledWrapper';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps {
  children: React.ReactNode;
  as?: HeadingLevel;
  testId?: string;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ children, as = 'h1', testId, className }) => (
  <HeadingWrapper as={as} className={className} data-testid={testId}>
    {children}
  </HeadingWrapper>
);

export default Heading;
