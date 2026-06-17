import React from 'react';
import styled from '@emotion/styled';
import { getInitials } from './getInitials';

export interface InitialsAvatarProps {
  collectionName: string;
}

/**
 * Default brand mark: a 26×26 rounded badge showing the collection initials
 * over the Bruno amber gradient. Both gradient stops are theme tokens
 * (--oc-brand → --oc-primary-subtle), so it adapts to light/dark — no hex.
 */
const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  flex: none;
  border-radius: var(--oc-border-radius-base);
  background: linear-gradient(135deg, var(--oc-brand), var(--oc-primary-subtle));
  color: var(--oc-button2-color-primary-text);
  font-family: var(--font-sans);
  font-size: var(--oc-font-size-xs);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.02em;
  user-select: none;
`;

const InitialsAvatar: React.FC<InitialsAvatarProps> = ({ collectionName }) => {
  const initials = getInitials(collectionName);
  return (
    <Badge aria-hidden="true" data-testid="brand-initials">
      {initials}
    </Badge>
  );
};

export default InitialsAvatar;
