import React from 'react';
import { LevelBadgeWrapper } from './StyledWrapper';

export type ScriptLevel = 'request' | 'folder' | 'collection' | 'inherited';

interface LevelBadgeProps {
  level: ScriptLevel;
  className?: string;
}

/** Small pill marking which scope an assert / test / script step comes from. */
export const LevelBadge: React.FC<LevelBadgeProps> = ({ level, className }) => (
  <LevelBadgeWrapper
    className={['oc-level-badge', `oc-level-badge--${level}`, className].filter(Boolean).join(' ')}
  >
    {level}
  </LevelBadgeWrapper>
);

export default LevelBadge;
