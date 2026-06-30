import React from 'react';
import { isTemplateVariable, templateVariableSplitRegex } from '../../utils/common';
import { StyledWrapper } from './StyledWrapper';

interface VariableTextProps {
  value: string;
  className?: string;
}

export const VariableText: React.FC<VariableTextProps> = ({ value, className }) => {
  const parts = (value ?? '').split(templateVariableSplitRegex()).filter((part) => part !== '');

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
