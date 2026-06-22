import React from 'react';
import { ContentTypeBadgeWrapper } from './StyledWrapper';

interface ContentTypeBadgeProps {
  label: string;
  className?: string;
}

/** Small muted pill for a full content type (e.g. "application/json") or an inherited-from badge. */
export const ContentTypeBadge: React.FC<ContentTypeBadgeProps> = ({ label, className }) => (
  <ContentTypeBadgeWrapper className={['oc-content-type-badge', className].filter(Boolean).join(' ')}>
    {label}
  </ContentTypeBadgeWrapper>
);

export default ContentTypeBadge;
