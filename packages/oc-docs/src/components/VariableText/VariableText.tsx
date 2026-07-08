import React, { useMemo } from 'react';
import { isTemplateVariable, templateVariableSplitRegex } from '../../utils/common';
import { useResolvedVariables } from '../../hooks';
import { StyledWrapper } from './StyledWrapper';

interface VariableTextProps {
  value: string;
  className?: string;
}

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
          <span key={index} className="var">
            {part}
          </span>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </StyledWrapper>
  );
};

export default VariableText;
