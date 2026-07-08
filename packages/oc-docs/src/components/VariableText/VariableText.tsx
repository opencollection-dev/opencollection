import React, { useMemo } from 'react';
import { isTemplateVariable, templateVariableSplitRegex } from '../../utils/common';
import { useResolvedVariables } from '../../hooks';
import { Popover } from '../../ui/Popover/Popover';
import { VariableInfoCard } from '../VariableInfoCard/VariableInfoCard';
import { StyledWrapper } from './StyledWrapper';

interface VariableTextProps {
  value: string;
  className?: string;
}

const VariableToken: React.FC<{ token: string }> = ({ token }) => {
  const name = token.slice(2, -2).trim();
  return (
    <Popover content={<VariableInfoCard name={name} />} testId="variable-info-popover">
      <span className="var" data-var-name={name}>
        {token}
      </span>
    </Popover>
  );
};

/**
 * Renders a string that may contain `{{var}}` tokens. Show-variables off: tokens
 * are shown verbatim and highlighted. On: tokens resolve against the active
 * environment; anything still unresolved (unknown or secret variables) stays
 * highlighted as a token, so a secret is never printed as plaintext.
 */
export const VariableText: React.FC<VariableTextProps> = ({ value, className }) => {
  const { showVars, resolve } = useResolvedVariables();
  const parts = useMemo(() => {
    const source = value ?? '';
    const display = showVars ? resolve(source) : source;
    return display.split(templateVariableSplitRegex()).filter((part) => part !== '');
  }, [value, showVars, resolve]);

  return (
    <StyledWrapper className={['var-text', className].filter(Boolean).join(' ')}>
      {parts.map((part, index) =>
        isTemplateVariable(part) ? (
          <VariableToken key={index} token={part} />
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </StyledWrapper>
  );
};

export default VariableText;
