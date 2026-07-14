import React, { useState } from 'react';
import { SECRET_MASK } from '../../constants';
import { EyeIcon, EyeOffIcon } from '../../assets/icons';
import { StyledWrapper } from './StyledWrapper';

interface SecretValueProps {
  value?: string | React.ReactNode;
  align?: 'between' | 'start';
  readOnly?: boolean;
  testId?: string;
}

export const SecretValue: React.FC<SecretValueProps> = ({ value = '', align = 'between', readOnly = false, testId = 'secret-value' }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const isValueVisible = isRevealed && !readOnly;

  return (
    <StyledWrapper
      className={['secret-value', align === 'start' ? 'secret-value--start' : '', readOnly ? 'secret-value--readonly' : '']
        .filter(Boolean)
        .join(' ')}
      data-testid={testId}
    >
      <span className="secret-value-text" aria-hidden={!isValueVisible} data-testid={testId && `${testId}-text`}>
        {isValueVisible ? value : SECRET_MASK}
      </span>
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
