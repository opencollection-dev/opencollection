import React from 'react';
import { StyledWrapper } from './StyledWrapper';

interface TitleLabelProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  testId?: string;
}

export const TitleLabel: React.FC<TitleLabelProps> = ({ children, style, className, testId = 'title-label' }) => (
  <StyledWrapper style={style} className={['title-label', className].filter(Boolean).join(' ')} data-testid={testId}>
    {children}
  </StyledWrapper>
);

export default TitleLabel;
