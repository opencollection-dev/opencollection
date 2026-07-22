import React from 'react';
import { getMethodColorVar } from '../../theme/methodColors';
import { getShortMethod } from '../../utils/request';
import { StyledWrapper } from './StyledWrapper';

interface MethodBadgeProps {
  method: string;
  className?: string;
  /** Render the abbreviated method (DELETE -> DEL, OPTIONS -> OPT) for tight spaces like the query bar. */
  short?: boolean;
}

export const MethodBadge: React.FC<MethodBadgeProps> = ({ method, className, short = false }) => {
  const resolvedMethod = method || 'GET';
  return (
    <StyledWrapper
      className={['method-badge', className].filter(Boolean).join(' ')}
      style={{ color: getMethodColorVar(method) }}
    >
      {short ? getShortMethod(resolvedMethod) : resolvedMethod.toUpperCase()}
    </StyledWrapper>
  );
};

export default MethodBadge;
