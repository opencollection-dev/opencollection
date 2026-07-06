import React from 'react';
import { isTemplateVariable, templateVariableSplitRegex } from '../../utils/common';
import { Tooltip } from '../../ui/Tooltip/Tooltip';
import { useVariableResolver } from '../../contexts/VariablesContext';
import { getVariableName } from '../../utils/variableInfo';
import { VariableInfoPopup } from '../VariableInfoPopup/VariableInfoPopup';
import { StyledWrapper } from './StyledWrapper';

interface VariableTextProps {
  value: string;
  className?: string;
}

export const VariableText: React.FC<VariableTextProps> = ({ value, className }) => {
  const resolve = useVariableResolver();
  const parts = (value ?? '').split(templateVariableSplitRegex()).filter((part) => part !== '');

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
