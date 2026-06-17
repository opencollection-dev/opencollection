import React from 'react';
import { getInitials } from '../../utils/getInitials';
import { Badge } from './StyledWrapper';

export interface InitialsAvatarProps {
  collectionName: string;
}

/**
 * Default brand mark: a rounded badge showing the collection initials over the
 * Bruno amber gradient.
 */
const InitialsAvatar: React.FC<InitialsAvatarProps> = ({ collectionName }) => (
  <Badge aria-hidden="true" data-testid="brand-initials">
    {getInitials(collectionName)}
  </Badge>
);

export default InitialsAvatar;
