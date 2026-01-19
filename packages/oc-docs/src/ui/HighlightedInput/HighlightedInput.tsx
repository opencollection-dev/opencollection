import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { findVariablesInText, type VariablesForHighlighting, type VariableMatch } from '../../utils/variables';
import { useVariables } from './VariablesContext';
import './HighlightedInput.css';

interface HighlightedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  readOnly?: boolean;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  autoCorrect?: string;
  autoCapitalize?: string;
  spellCheck?: boolean;
  /** Override variables from context */
  variables?: VariablesForHighlighting;
}

/**
 * HighlightedInput - A text input that highlights {{variables}}
 *
 * Uses an overlay technique: the actual input is transparent but captures
 * all keyboard/mouse events, while a div behind it renders the highlighted text.
 */
const HighlightedInputInner: React.FC<HighlightedInputProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  style,
  disabled = false,
  readOnly = false,
  onKeyPress,
  onFocus,
  onBlur,
  autoComplete = 'off',
  autoCorrect = 'off',
  autoCapitalize = 'off',
  spellCheck = false,
  variables: propVariables
}) => {
  const contextVariables = useVariables();
  const variables = propVariables ?? contextVariables;
  const inputRef = useRef<HTMLInputElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const syncScroll = useCallback(() => {
    if (inputRef.current && highlightRef.current) {
      highlightRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  }, []);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    
    input.addEventListener('scroll', syncScroll);
    return () => {
      input.removeEventListener('scroll', syncScroll);
    };
  }, [syncScroll]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const highlightedContent = useMemo(() => {
    if (!value) return null;

    const matches = findVariablesInText(value, variables);
    
    if (matches.length === 0) {
      return <span className="highlighted-text-plain">{value}</span>;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((match: VariableMatch, idx: number) => {
      if (match.start > lastIndex) {
        parts.push(
          <span key={`text-${idx}`} className="highlighted-text-plain">
            {value.slice(lastIndex, match.start)}
          </span>
        );
      }

      parts.push(
        <span
          key={`var-${idx}`}
          className={`highlighted-variable ${match.isValid ? 'variable-valid' : 'variable-invalid'}`}
          title={match.isValid ? `${match.name}: ${variables[match.name] ?? ''}` : `Variable "${match.name}" is not defined`}
        >
          {match.fullMatch}
        </span>
      );

      lastIndex = match.end;
    });

    if (lastIndex < value.length) {
      parts.push(
        <span key="text-end" className="highlighted-text-plain">
          {value.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  }, [value, variables]);

  return (
    <div className={`highlighted-input-container ${className}`} style={style}>
      <div
        ref={highlightRef}
        className="highlighted-input-backdrop"
        aria-hidden="true"
      >
        {highlightedContent || (
          <span className="highlighted-text-placeholder">{placeholder}</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="text"
        className="highlighted-input-field"
        value={value}
        onChange={handleChange}
        placeholder=""
        disabled={disabled}
        readOnly={readOnly}
        onKeyPress={onKeyPress}
        onFocus={onFocus}
        onBlur={onBlur}
        onScroll={syncScroll}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        spellCheck={spellCheck}
      />
    </div>
  );
};

/**
 * Memoized HighlightedInput to prevent unnecessary re-renders.
 * Only re-renders when props actually change.
 */
const HighlightedInput = React.memo(HighlightedInputInner);

HighlightedInput.displayName = 'HighlightedInput';

export default HighlightedInput;
