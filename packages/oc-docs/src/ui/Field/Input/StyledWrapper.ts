import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 43.75rem;

  .oc-input {
    width: 100%;
    padding: 0.3125rem 0.625rem;
    font-family: inherit;
    font-size: 0.8125rem;
    line-height: 1rem;
    color: var(--text-primary);
    background-color: var(--bg-primary);
    border: 0.0625rem solid var(--oc-border-border0);
    border-radius: 0.375rem;
    transition: border-color 0.15s ease;
  }

  .oc-input::placeholder {
    color: var(--oc-colors-text-subtext0);
    opacity: 0.6;
  }

  .oc-input:focus,
  .oc-input:focus-visible {
    outline: none;
  }

  .oc-input:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &.oc-input-wrapper--secret .oc-input {
    padding-right: 2.25rem;
  }

  .oc-input-toggle {
    position: absolute;
    right: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    color: var(--text-muted);
    background: transparent;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: color 0.15s ease;
  }

  .oc-input-toggle:hover {
    color: var(--text-primary);
  }

  .oc-input-toggle:focus-visible {
    outline: 0.125rem solid var(--text-muted);
    outline-offset: 0.0625rem;
  }

  .oc-input-toggle:disabled {
    cursor: not-allowed;
  }

  .oc-input-toggle svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;
