import React, { useState } from 'react';
import { SecretValueWrapper } from './StyledWrapper';

/** Fixed-length mask so the real length of the secret is never leaked. */
export const SECRET_MASK = '•'.repeat(12);

interface SecretValueProps {
  value: string;
  /** Test hook (`data-testid`); the text gets `${testId}-text`, the toggle `${testId}-toggle`. */
  testId?: string;
}

const EyeIcon: React.FC<{ off?: boolean }> = ({ off }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {off ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

/**
 * A masked, reveal-on-demand value (used for passwords/tokens in read-only config).
 * The masked form is a fixed length so the secret's true length is not exposed.
 */
export const SecretValue: React.FC<SecretValueProps> = ({ value, testId }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <SecretValueWrapper className="secret-value" data-testid={testId}>
      {/* While masked, hide the placeholder dots from assistive tech so they aren't
          read out as "bullet" repeatedly; the toggle's label conveys it's hidden. */}
      <span className="secret-value-text" aria-hidden={!revealed} data-testid={testId ? `${testId}-text` : undefined}>
        {revealed ? value : SECRET_MASK}
      </span>
      <button
        type="button"
        className="secret-value-toggle"
        aria-label={revealed ? 'Hide value' : 'Show value'}
        aria-pressed={revealed}
        data-testid={testId ? `${testId}-toggle` : undefined}
        onClick={() => setRevealed((prev) => !prev)}
      >
        <EyeIcon off={revealed} />
      </button>
    </SecretValueWrapper>
  );
};

export default SecretValue;
