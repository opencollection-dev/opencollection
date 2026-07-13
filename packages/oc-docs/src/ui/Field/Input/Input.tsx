import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from '../../../assets/icons';
import { StyledWrapper } from './StyledWrapper';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  type?: string;
  secret?: boolean;
  placeholder?: string;
  testId?: string;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  id,
  type = 'text',
  secret = false,
  placeholder,
  testId,
  ariaLabel,
  disabled = false,
  className
}) => {
  const [revealed, setRevealed] = useState(false);
  const resolvedType = secret ? (revealed ? 'text' : 'password') : type;

  return (
    <StyledWrapper className={['oc-input-wrapper', secret && 'oc-input-wrapper--secret', className].filter(Boolean).join(' ')}>
      <input
        id={id}
        type={resolvedType}
        className="oc-input"
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        data-testid={testId}
        disabled={disabled}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
      />
      {secret && (
        <button
          type="button"
          className="oc-input-toggle"
          aria-label={revealed ? 'Hide value' : 'Show value'}
          aria-pressed={revealed}
          data-testid={testId ? `${testId}-toggle` : undefined}
          disabled={disabled}
          onClick={() => setRevealed((prev) => !prev)}
        >
          {revealed ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      )}
    </StyledWrapper>
  );
};

export default Input;
