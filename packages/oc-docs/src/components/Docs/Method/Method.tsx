import React from 'react';
import { getShortMethod } from '../../../utils/request';
import { StyledWrapper } from './StyledWrapper';

interface MethodProps {
  method: string;
  className?: string;
}

export const Method: React.FC<MethodProps> = ({ method, className = '' }) => {
  const normalizedMethod = method?.toLowerCase() || 'get';
  const displayMethod = getShortMethod(method || 'GET');

  return (
    <StyledWrapper className={`${normalizedMethod} ${className}`}>
      {displayMethod}
    </StyledWrapper>
  );
};

export default Method;
