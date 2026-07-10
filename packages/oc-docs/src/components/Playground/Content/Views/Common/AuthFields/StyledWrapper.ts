import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  &.auth-field {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .auth-field-label {
    width: 8.5rem;
    flex-shrink: 0;
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    color: var(--text-secondary);
  }

  .auth-control {
    flex: 1;
    min-width: 0;
    padding: 0.375rem 0.5rem;
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    line-height: 1.4;
    color: var(--text-primary);
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--oc-radius);
    outline: none;
    transition: border-color 0.15s ease;

    &:focus,
    &:focus-visible {
      outline: none;
      border-color: var(--border-strong);
    }

    &::placeholder {
      color: var(--text-tertiary);
    }
  }

  &.auth-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    color: var(--text-primary);

    & input {
      accent-color: var(--primary-color);
    }
  }
`;
