import React from 'react';
import { getMethodColorVar } from '../../theme/methodColors';
import { StyledWrapper } from './StyledWrapper';

interface MethodBadgeProps {
  method: string;
  variant?: 'text' | 'pill';
  className?: string;
}

export const MethodBadge: React.FC<MethodBadgeProps> = ({ method, variant = 'text', className }) => (
  <StyledWrapper
    className={['method-badge', variant === 'pill' ? 'pill' : '', className].filter(Boolean).join(' ')}
    style={{ color: getMethodColorVar(method) }}
  >
    {(method || 'GET').toUpperCase()}
  </StyledWrapper>
);

export default MethodBadge;
