import React, { useMemo } from 'react';
import { isTemplateVariable, templateVariableSplitRegex } from '../../utils/common';
import { VariableToken } from './VariableToken';

interface VariableTextProps {
  value: string;
  className?: string;
}

type TextPart = { kind: 'token'; token: string } | { kind: 'text'; text: string };

export const VariableText: React.FC<VariableTextProps> = ({ value, className }) => {
  const parts = useMemo<TextPart[]>(() => {
    const source = value ?? '';
    return source
      .split(templateVariableSplitRegex())
      .filter((part) => part !== '')
      .map((part) => (isTemplateVariable(part) ? { kind: 'token', token: part } : { kind: 'text', text: part }));
  }, [value]);

  return (
    <span className={['var-text', className].filter(Boolean).join(' ')}>
      {parts.map((part, index) =>
        part.kind === 'token' ? (
          <VariableToken key={index} token={part.token} />
        ) : (
          <React.Fragment key={index}>{part.text}</React.Fragment>
        )
      )}
    </span>
  );
};

export default VariableText;
