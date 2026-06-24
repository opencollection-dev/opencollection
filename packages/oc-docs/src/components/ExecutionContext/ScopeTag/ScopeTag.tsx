import React from 'react';
import { StyledWrapper } from './StyledWrapper';

export type Scope = 'request' | 'folder' | 'collection';

interface ScopeTagProps {
  scope: Scope;
}

export const ScopeTag: React.FC<ScopeTagProps> = ({ scope }) => (
  <StyledWrapper className={`scope-tag scope-tag--${scope}`}>{scope}</StyledWrapper>
);

export default ScopeTag;
