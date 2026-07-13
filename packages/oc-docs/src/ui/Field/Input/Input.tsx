import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from '../../../assets/icons';
import { StyledWrapper } from './StyledWrapper';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  secret?: boolean;
  placeholder?: string;
  testId?: string;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  id,
  secret = false,
  placeholder,
  testId
}) => {
  const [revealed, setRevealed] = useState(false);
  const resolvedType = secret ? (revealed ? 'text' : 'password') : 'text';

  return (
    <StyledWrapper className={['oc-input-wrapper', secret && 'oc-input-wrapper--secret'].filter(Boolean).join(' ')}>
      <input
        id={id}
        type={resolvedType}
        className="oc-input"
        value={value}
        placeholder={placeholder}
        data-testid={testId}
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
          onClick={() => setRevealed((prev) => !prev)}
        >
          {revealed ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      )}
    </StyledWrapper>
  );
};

export default Input;
