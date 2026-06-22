import React from 'react';
import { VariableTextWrapper } from './StyledWrapper';

// Split on (and keep) `{{...}}` tokens; the second pattern tests a single segment.
const SPLIT_PATTERN = /(\{\{[^}]+\}\})/g;
const IS_VARIABLE = /^\{\{[^}]+\}\}$/;

interface VariableTextProps {
  /** Text that may contain `{{variable}}` tokens to highlight. */
  value: string;
  className?: string;
}

/**
 * Renders text with `{{...}}` template tokens highlighted in the accent colour and
 * the rest in the inherited colour. Used for URLs, header/param/var values, etc.
 */
export const VariableText: React.FC<VariableTextProps> = ({ value, className }) => {
  const parts = (value ?? '').split(SPLIT_PATTERN).filter((part) => part !== '');

  return (
    <VariableTextWrapper className={['oc-var-text', className].filter(Boolean).join(' ')}>
      {parts.map((part, index) =>
        IS_VARIABLE.test(part) ? (
          <span key={index} className="oc-var">
            {part}
          </span>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </VariableTextWrapper>
  );
};

export default VariableText;
