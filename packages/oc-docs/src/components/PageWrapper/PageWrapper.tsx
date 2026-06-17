import React from 'react';
import { PageWrapperContainer } from './StyledWrapper';

interface PageWrapperProps {
  children: React.ReactNode;
  /** Optional extra class for the page (merged with the base `page-wrapper` class). */
  className?: string;
}

/**
 * Common layout wrapper for pages. Applies the shared page padding so every page has
 * consistent gutters; pages render their own content inside it. Presentational and
 * prop-driven, so it can be lifted into a component package.
 */
export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className }) => (
  <PageWrapperContainer className={['page-wrapper', className].filter(Boolean).join(' ')}>
    {children}
  </PageWrapperContainer>
);

export default PageWrapper;
