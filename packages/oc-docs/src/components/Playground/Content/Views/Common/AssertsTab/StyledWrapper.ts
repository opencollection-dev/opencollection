import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .asserts-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .asserts-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .asserts-description {
    font-size: 0.75rem;
    line-height: 1.25;
    color: var(--text-secondary);
  }

  .operator-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    width: 100%;
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

  .asserts-hint {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: var(--text-secondary);
  }
`;
