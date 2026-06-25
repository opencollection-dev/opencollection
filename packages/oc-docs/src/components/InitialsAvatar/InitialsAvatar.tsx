import React from 'react';
import { getInitials } from '../../utils/common';
import { StyledWrapper } from './StyledWrapper';

export interface InitialsAvatarProps {
  collectionName: string;
  testId?: string;
}

/**
 * Default brand mark: a rounded badge showing the collection initials over the
 * Bruno amber gradient.
 */
const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  collectionName,
  testId = 'brand-initials',
}) => (
  <StyledWrapper aria-hidden="true" data-testid={testId}>
    {getInitials(collectionName)}
  </StyledWrapper>
);

export default InitialsAvatar;
