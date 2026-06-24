import React from 'react';
import { getMethodColorVar } from '../../theme/methodColors';
import { StyledWrapper } from './StyledWrapper';

interface MethodBadgeProps {
  method: string;
  className?: string;
}

export const MethodBadge: React.FC<MethodBadgeProps> = ({ method, className }) => (
  <StyledWrapper
    className={['method-badge', className].filter(Boolean).join(' ')}
    style={{ color: getMethodColorVar(method) }}
  >
    {(method || 'GET').toUpperCase()}
  </StyledWrapper>
);

export default MethodBadge;
