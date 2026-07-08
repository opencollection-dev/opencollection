import React from 'react';
import { useResolvedVariables } from '../../hooks';
import { Popover } from '../../ui/Popover/Popover';
import { VariableInfoCard } from '../VariableInfoCard/VariableInfoCard';
import { StyledWrapper } from './StyledWrapper';

/**
 * A single `{{var}}` occurrence: show-vars aware, and inspectable via a hover card
 * while it is still a token. `highlighted` draws the brand chip for prose
 * (`VariableText`); code passes `false` to keep the surrounding line's color.
 *
 * Once the variable is revealed (showing its resolved value) the card is disabled —
 * it would only repeat what is already on screen. Secrets and unknown names stay as their `{{token}}`, so they keep the card.
 */
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
