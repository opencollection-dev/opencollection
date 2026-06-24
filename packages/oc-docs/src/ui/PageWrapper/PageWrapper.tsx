import React from 'react';
import { StyledWrapper } from './StyledWrapper';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Common layout wrapper for pages. Applies the shared page padding so every page has
 * consistent gutters; pages render their own content inside it.
 */
export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className }) => (
  <StyledWrapper className={['page-wrapper', className].filter(Boolean).join(' ')}>
    {children}
  </StyledWrapper>
);

export default PageWrapper;
