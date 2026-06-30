import React from 'react';
import { StyledWrapper } from './StyledWrapper';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingSize = 'lg' | 'md';

interface HeadingProps {
  children: React.ReactNode;
  as?: HeadingLevel;
  size?: HeadingSize;
  style?: React.CSSProperties;
  className?: string;
  testId?: string;
}

export const Heading: React.FC<HeadingProps> = ({ children, as = 'h1', size = 'lg', style, className, testId = 'heading' }) => (
  <StyledWrapper
    as={as}
    style={style}
    className={['heading', `heading--${size}`, className].filter(Boolean).join(' ')}
    data-testid={testId}
  >
    {children}
  </StyledWrapper>
);

export default Heading;
