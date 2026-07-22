import React, { useState } from 'react';
import { SECRET_MASK } from '../../constants';
import { EyeIcon, EyeOffIcon } from '../../assets/icons';
import { cx } from '../../utils/cx';
import { StyledWrapper } from './StyledWrapper';

interface SecretValueProps {
  value?: React.ReactNode;
  align?: 'between' | 'start';
  readOnly?: boolean;
  editByDefault?: boolean;
  multiline?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  testId?: string;
}

export const SecretValue: React.FC<SecretValueProps> = ({
  value = '',
  align = 'between',
  readOnly = false,
  editByDefault = false,
  multiline = false,
  onChange,
  placeholder,
  className,
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
      }, className)}
      data-testid={testId}
    >
      {editable ? (
        multiline ? (
          <textarea
            className={cx('secret-value-input', { 'secret-value-input--masked': !isRevealed })}
            value={typeof value === 'string' ? value : ''}
            placeholder={placeholder}
            readOnly={!editByDefault && !isRevealed}
            onChange={(e) => onChange?.(e.target.value)}
            data-testid={testId && `${testId}-input`}
            rows={1}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        ) : (
          <input
            className="secret-value-input"
            type={isRevealed ? 'text' : 'password'}
            value={typeof value === 'string' ? value : ''}
            placeholder={placeholder}
            readOnly={!editByDefault && !isRevealed}
            onChange={(e) => onChange?.(e.target.value)}
            data-testid={testId && `${testId}-input`}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        )
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
