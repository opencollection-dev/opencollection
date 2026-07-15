import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  gap: 0.5rem;
  padding: 0.25rem 0.375rem;
  border: 1px solid var(--border-color);
  border-radius: var(--oc-radius);
  transition: border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: var(--bg-primary);

  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--oc-brand) 10%, transparent),
                0 1px 2px color-mix(in srgb, var(--oc-text) 5%, transparent);
  }

  input {
    outline: none;
    background-color: transparent;
    color: var(--text-primary);
    border-radius: 0;
    border: none;
    transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &::placeholder {
      color: var(--text-secondary);
      opacity: 0.6;
      transition: opacity 0.2s ease;
    }

    &:focus::placeholder {
      opacity: 0.45;
    }

    &:focus {
      background-color: color-mix(in srgb, var(--oc-text) 1%, transparent);
    }
  }

  .method-select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 0.375rem;
  }

  .method-badge {
    padding: 0.125rem 0.5rem;
    border-radius: var(--oc-radius);
    background-color: color-mix(in srgb, currentColor 12%, transparent);
  }

  select.method-select {
    position: absolute;
    inset: 0;
    appearance: none;
    border: none;
    outline: none;
    opacity: 0;
    cursor: pointer;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  button.send {
    height: 1.75rem;
    padding: 0 0.875rem;
    border-radius: var(--oc-radius);
    background-color: var(--primary-color);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.01em;
    transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover:not(:disabled) {
      background-color: color-mix(in srgb, var(--oc-brand) 85%, black);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;
