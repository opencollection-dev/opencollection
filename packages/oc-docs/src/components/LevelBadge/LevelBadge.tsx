import React from 'react';
import { StyledWrapper } from './StyledWrapper';

export type ScriptLevel = 'request' | 'folder' | 'collection' | 'inherited';

interface LevelBadgeProps {
  level: ScriptLevel;
  className?: string;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({ level, className }) => (
  <StyledWrapper
    className={['oc-level-badge', `oc-level-badge--${level}`, className].filter(Boolean).join(' ')}
  >
    {level}
  </StyledWrapper>
);

export default LevelBadge;
