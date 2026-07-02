import React from 'react';
import { StyledWrapper } from './StyledWrapper';

interface EnvironmentLabelProps {
  name: string;
  color?: string;
  className?: string;
  nameClassName?: string;
  testId?: string;
}

export const EnvironmentLabel: React.FC<EnvironmentLabelProps> = ({
  name,
  color,
  className,
  nameClassName,
  testId
}) => (
  <StyledWrapper className={['environment-label', className].filter(Boolean).join(' ')} data-testid={testId}>
    <span className="environment-label-dot" style={color ? { background: color } : undefined} />
    <span className={['environment-label-name', nameClassName].filter(Boolean).join(' ')}>{name}</span>
  </StyledWrapper>
);

export default EnvironmentLabel;
