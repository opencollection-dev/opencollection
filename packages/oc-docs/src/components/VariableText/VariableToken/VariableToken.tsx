import React from 'react';
import { useResolvedVariables } from '../../../hooks';
import { Popover } from '../../../ui/Popover/Popover';
import { VariableInfoCard } from '../../VariableInfoCard/VariableInfoCard';
import { StyledWrapper } from './StyledWrapper';

export const VariableToken: React.FC<{ token: string; highlighted?: boolean }> = ({ token, highlighted = true }) => {
  const { showVars, resolve } = useResolvedVariables();
  const name = token.slice(2, -2).trim();
  const display = showVars ? resolve(token) : token;
  const revealed = display !== token;
  const variant = highlighted ? 'var-highlight' : revealed ? undefined : 'var-plain';

  return (
    <Popover content={<VariableInfoCard name={name} />} testId="variable-info-popover" disabled={revealed}>
      <StyledWrapper
        className={['var', variant].filter(Boolean).join(' ')}
        data-var-name={name}
        data-testid={`variable-token-${name}`}
      >
        {display}
      </StyledWrapper>
    </Popover>
  );
};

export default VariableToken;
