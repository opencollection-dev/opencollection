import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  background-color: var(--bg-secondary);
  border: 1px solid var(--oc-border-border2);
  border-left: 4px solid var(--oc-status-danger-border);
  border-radius: var(--oc-border-radius-base);
  padding: 1rem;

  .error-title {
    font-weight: 600;
    color: var(--oc-status-danger-text);
    margin-bottom: 0.5rem;
  }

  .error-message {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    line-height: 1.3rem;
    white-space: pre-wrap;
    word-break: break-all;
    color: var(--text-primary);
  }

  .error-hint {
    margin-top: 0.75rem;
    font-size: 0.8125rem;
    line-height: 1.3rem;
    white-space: pre-wrap;
    color: var(--text-secondary);
  }
`;
