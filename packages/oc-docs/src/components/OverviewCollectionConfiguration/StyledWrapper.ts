import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  .config-group + .config-group {
    margin-top: 1.75rem;
  }

  .config-group + .config-hidden {
    margin-top: 1.75rem;
  }

  .config-empty-message {
    margin: 0;
    font-family: var(--font-sans);
    font-weight: 500;
    font-style: italic;
    font-size: 0.8125rem;
    line-height: 1;
    letter-spacing: normal;
    color: var(--text-secondary);
  }

  .script-block + .script-block {
    margin-top: 1rem;
  }
  .script-phase-label {
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: 0.625rem;
    line-height: 1;
    letter-spacing: 0.0525rem;
    color: var(--text-tertiary);
    margin: 0 0 0.375rem 0;
  }
  .script-label {
    font-family: var(--font-sans);
    font-weight: 600;
    font-size: 0.75rem;
    line-height: 1;
    letter-spacing: 0.0525rem;
    color: var(--text-primary);
    margin: 0 0 0.375rem 0;
  }
`;
