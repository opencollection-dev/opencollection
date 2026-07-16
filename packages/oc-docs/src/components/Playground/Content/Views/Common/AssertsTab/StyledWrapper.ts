import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  .asserts-title {
    color: var(--text-primary);
  }

  .asserts-description {
    color: var(--text-secondary);
  }

  .asserts-hint {
    color: var(--text-secondary);
  }

  .operator-trigger {
    width: 100%;
    gap: 0.5rem;
    padding: 0.25rem 0.5rem;
    font-family: inherit;
    font-size: 0.8125rem;
    text-align: left;
    color: var(--text-primary);
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .operator-caret {
    flex-shrink: 0;
    color: var(--oc-colors-text-muted);
  }
`;
