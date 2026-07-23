import React from 'react';
import cx from '../../utils/cx';
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
      className={cx('method-badge', className)}
      style={{ color: getMethodColorVar(method) }}
    >
      {short ? getShortMethod(resolvedMethod) : resolvedMethod.toUpperCase()}
    </StyledWrapper>
  );
};

export default MethodBadge;
