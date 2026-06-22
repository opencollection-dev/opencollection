import React from 'react';
import { getMethodColorVar } from '../../theme/methodColors';
import { MethodBadgeWrapper } from './StyledWrapper';

interface MethodBadgeProps {
  method: string;
  className?: string;
}

/** Coloured HTTP method label (GET/POST/…), tinted via the theme method-color tokens. */
export const MethodBadge: React.FC<MethodBadgeProps> = ({ method, className }) => (
  <MethodBadgeWrapper
    className={['oc-method-badge', className].filter(Boolean).join(' ')}
    style={{ color: getMethodColorVar(method) }}
  >
    {(method || 'GET').toUpperCase()}
  </MethodBadgeWrapper>
);

export default MethodBadge;
