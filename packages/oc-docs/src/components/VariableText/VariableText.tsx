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

type TextPart = { kind: 'token'; token: string; display: string } | { kind: 'text'; text: string };

const VariableToken: React.FC<{ token: string; display: string }> = ({ token, display }) => {
  const name = token.slice(2, -2).trim();
  return (
    <Popover content={<VariableInfoCard name={name} />} testId="variable-info-popover">
      <span className="var" data-var-name={name}>
        {display}
      </span>
    </Popover>
  );
};

/**
 * Renders a string that may contain `{{var}}` tokens. Each token keeps its
 * highlighted, hover-inspectable span whether or not show-variables is on: off it
 * shows the raw `{{var}}`, on it shows the resolved value, but the highlight and
 * hover card are identical. Anything still unresolved (unknown or secret
 * variables) keeps its `{{var}}` text, so a secret is never printed as plaintext.
 */
export const VariableText: React.FC<VariableTextProps> = ({ value, className }) => {
  const { showVars, resolve } = useResolvedVariables();
  const parts = useMemo<TextPart[]>(() => {
    const source = value ?? '';
    return source
      .split(templateVariableSplitRegex())
      .filter((part) => part !== '')
      .map((part) =>
        isTemplateVariable(part)
          ? { kind: 'token', token: part, display: showVars ? resolve(part) : part }
          : { kind: 'text', text: part }
      );
  }, [value, showVars, resolve]);

  return (
    <StyledWrapper className={['var-text', className].filter(Boolean).join(' ')}>
      {parts.map((part, index) =>
        part.kind === 'token' ? (
          <VariableToken key={index} token={part.token} display={part.display} />
        ) : (
          <React.Fragment key={index}>{part.text}</React.Fragment>
        )
      )}
    </StyledWrapper>
  );
};

export default VariableText;
