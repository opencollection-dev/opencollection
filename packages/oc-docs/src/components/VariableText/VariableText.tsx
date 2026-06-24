import React from 'react';
import { StyledWrapper } from './StyledWrapper';

const SPLIT_PATTERN = /(\{\{[^}]+\}\})/g;
const IS_VARIABLE = /^\{\{[^}]+\}\}$/;

interface VariableTextProps {
  value: string;
  className?: string;
}

export const VariableText: React.FC<VariableTextProps> = ({ value, className }) => {
  const parts = (value ?? '').split(SPLIT_PATTERN).filter((part) => part !== '');

  return (
    <StyledWrapper className={['var-text', className].filter(Boolean).join(' ')}>
      {parts.map((part, index) =>
        IS_VARIABLE.test(part) ? (
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
