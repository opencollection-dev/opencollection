import React, { useMemo } from 'react';
import { isTemplateVariable, templateVariableSplitRegex } from '../../utils/common';
import { Tooltip } from '../../ui/Tooltip/Tooltip';
import { getVariableName } from '../../utils/variableInfo';
import { VariableInfoPopup } from '../VariableInfoPopup/VariableInfoPopup';
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
      {parts.map((part, index) => {
        if (!isTemplateVariable(part)) {
          return <React.Fragment key={index}>{part}</React.Fragment>;
        }
        const name = getVariableName(part);
        const info = resolve(name);
        const token = <span className="var">{part}</span>;
        return info ? (
          <Tooltip
            key={index}
            content={<VariableInfoPopup name={name} info={info} />}
            className="oc-tooltip--card"
            interactive
            testId="variable-info"
          >
            {token}
          </Tooltip>
        ) : (
          <React.Fragment key={index}>{token}</React.Fragment>
        );
      })}
    </StyledWrapper>
  );
};

export default VariableText;
