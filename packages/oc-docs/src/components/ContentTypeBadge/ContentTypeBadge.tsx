import React from 'react';
import { StyledWrapper } from './StyledWrapper';

interface ContentTypeBadgeProps {
  label: string;
  className?: string;
}

export const ContentTypeBadge: React.FC<ContentTypeBadgeProps> = ({ label, className }) => (
  <StyledWrapper className={['oc-content-type-badge', className].filter(Boolean).join(' ')}>
    {label}
  </StyledWrapper>
);

export default ContentTypeBadge;
