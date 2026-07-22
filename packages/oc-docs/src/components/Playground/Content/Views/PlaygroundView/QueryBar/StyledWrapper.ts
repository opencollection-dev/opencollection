import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--oc-radius);
  background-color: var(--bg-primary);

  && .highlight-input {
    flex: 1;
    min-width: 0;
    padding: 0;
    font-family: var(--font-mono);
  }

  && .highlight-input .text-input,
  && .highlight-input .highlight-input-mirror {
    padding: 0;
    font-size: 0.75rem;
    line-height: 1.125rem;
  }

  && .highlight-input .highlight-input-mirror {
    right: 0;
    left: 0;
    color: var(--text-primary);
  }

  && .highlight-input .highlight-input-mirror .variable-valid,
  && .highlight-input .highlight-input-mirror .variable-invalid {
    color: var(--primary-text);
    background-color: var(--brand-soft);
    border-radius: 0.1875rem;
    padding: 0 0.1875rem;
    margin: 0 -0.1875rem;
  }

  && .highlight-input .text-input::placeholder {
    color: var(--text-secondary);
    opacity: 0.6;
  }

  .method-select-wrapper {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .method-select {
    appearance: none;
    display: inline-flex;
    align-items: center;
    margin: 0;
    padding: 0;
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
  }

  .method-select .method-badge {
    font-size: 0.75rem;
    line-height: 1.125rem;
    letter-spacing: 0.04em;
    min-width: unset;
    padding: 0;
  }

  .actions {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  button.send {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.3125rem;
    height: 1.5rem;
    padding: 0 0.5625rem;
    border: 1px solid var(--oc-brand);
    border-radius: var(--oc-radius);
    background-color: var(--oc-brand);
    color: var(--oc-background-base);
    font-family: var(--font-sans);
    font-weight: 600;
    font-size: 0.71875rem;
    line-height: 1;
    letter-spacing: 0;
    white-space: nowrap;
    cursor: pointer;

    &:hover:not(:disabled) {
      opacity: 0.92;
    }
    &:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;
