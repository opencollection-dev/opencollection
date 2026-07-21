import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  .test-row:not(:first-child) {
    border-top: 1px solid var(--oc-border-border0);
  }
  .test-head {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-height: 2rem;
    padding: 0.375rem 1rem;
    cursor: pointer;
  }
  .test-name {
    min-width: 0;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .test-name--raw {
    font-family: var(--font-sans);
    font-style: italic;
    color: var(--text-secondary);
  }
  .test-spacer {
    flex: 1;
  }
  .test-code {
    padding: 0 16px 14px;
  }

  .code-toggle {
    flex: none;
    white-space: nowrap;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--primary-text);
  }
  .code-toggle:hover {
    text-decoration: underline;
  }
  .code-toggle:focus-visible {
    outline: 2px solid var(--oc-status-info-text);
    outline-offset: 0.125rem;
    border-radius: 0.25rem;
  }
`;
