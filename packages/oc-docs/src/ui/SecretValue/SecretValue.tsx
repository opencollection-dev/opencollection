import React, { useState } from 'react';
import { SECRET_MASK } from '../../constants';
import { EyeIcon, EyeOffIcon } from '../../assets/icons';
import { cx } from '../../utils/cx';
import { StyledWrapper } from './StyledWrapper';

interface SecretValueProps {
  value?: React.ReactNode;
  align?: 'between' | 'start';
  readOnly?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
  testId?: string;
}

export const SecretValue: React.FC<SecretValueProps> = ({
  value = '',
  align = 'between',
  readOnly = false,
  onChange,
  placeholder,
  testId = 'secret-value'
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const editable = !!onChange && !readOnly;
  const isValueVisible = isRevealed && !readOnly;

  return (
    <StyledWrapper
      className={cx('secret-value', {
        'secret-value--start': align === 'start',
        'secret-value--readonly': readOnly
      })}
      data-testid={testId}
    >
      {editable ? (
        <input
          className="secret-value-input"
          type={isRevealed ? 'text' : 'password'}
          value={typeof value === 'string' ? value : ''}
          placeholder={placeholder}
          readOnly={!isRevealed}
          onChange={(e) => onChange?.(e.target.value)}
          data-testid={testId && `${testId}-input`}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      ) : (
        <span className="secret-value-text" aria-hidden={!isValueVisible} data-testid={testId && `${testId}-text`}>
          {isValueVisible ? value : SECRET_MASK}
        </span>
      )}
      {readOnly ? (
        <span className="secret-value-icon" aria-hidden="true" data-testid={testId && `${testId}-icon`}>
          <EyeOffIcon />
        </span>
      ) : (
        <button
          type="button"
          className="secret-value-toggle"
          aria-label={isRevealed ? 'Hide value' : 'Show value'}
          aria-pressed={isRevealed}
          data-testid={testId && `${testId}-toggle`}
          onClick={() => setIsRevealed((prev) => !prev)}
        >
          {isRevealed ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      )}
    </StyledWrapper>
  );
};

export default SecretValue;
