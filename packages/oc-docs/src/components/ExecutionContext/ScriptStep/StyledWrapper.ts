import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  .script-line {
    display: grid;
    grid-template-columns: 1.25rem 0.875rem minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
  }

  .step-num {
    justify-self: end;
    font-family: var(--font-mono);
    font-size: 0.71875rem;
    color: var(--text-muted);
  }

  .script-step-head {
    cursor: pointer;
  }
  .script-step-head:focus-visible {
    outline: 2px solid var(--oc-status-info-text);
    outline-offset: -2px;
    border-radius: 0.375rem;
  }

  .script-chevron {
    color: var(--text-muted);
  }

  .script-step-main {
    min-width: 0;
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .script-step-label {
    flex: none;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-primary);
    text-transform: none;
    letter-spacing: normal;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .script-step-source {
    min-width: 0;
    font-family: var(--font-sans);
    font-size: 0.6875rem;
    font-weight: 400;
    color: var(--text-secondary);
    text-transform: none;
    letter-spacing: normal;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  button.script-step-source {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }
  button.script-step-source:hover {
    color: var(--text-primary);
    text-decoration: underline;
  }
  button.script-step-source:focus-visible {
    outline: 2px solid var(--oc-status-info-text);
    outline-offset: 0.125rem;
    border-radius: 0.125rem;
  }

  .code-toggle {
    justify-self: end;
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

  .script-code-inner {
    padding: 0 1rem 0.875rem 3.5rem;
  }

  @media (max-width: 600px) {
    .script-line {
      gap: 0.5rem;
      padding: 0.625rem 0.75rem;
    }
    .script-step-label {
      white-space: normal;
      overflow-wrap: anywhere;
    }
    .script-code-inner {
      padding: 0 0.75rem 0.75rem 0.75rem;
    }
  }
`;
