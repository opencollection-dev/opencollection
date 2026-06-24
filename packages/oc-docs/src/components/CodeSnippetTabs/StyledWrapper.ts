import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  .oc-snippet-box {
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    overflow: hidden;
    background: var(--oc-background-base);
  }

  .oc-snippet-head {
    display: flex;
    align-items: stretch;
    min-height: 2.375rem;
    padding: 0 0.375rem;
    border-bottom: 1px solid var(--border-color);
  }

  .oc-snippet-tabs {
    display: flex;
    align-items: stretch;
  }

  .oc-snippet-tab {
    display: inline-flex;
    align-items: center;
    padding: 0 0.625rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    font-family: var(--font-sans);
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1;
    color: var(--text-muted);
    cursor: pointer;
    transition: color 0.12s ease;
  }
  .oc-snippet-tab:hover {
    color: var(--text-primary);
  }
  .oc-snippet-tab.is-active {
    color: var(--text-primary);
    font-weight: 600;
    border-bottom-color: var(--primary-color);
  }
  .oc-snippet-tab:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }

  .oc-snippet-head-spacer {
    flex: 1;
  }

  .oc-snippet-box .code-content-wrapper {
    border: none;
    border-radius: 0;
  }

  && .code-copy-floating {
    opacity: 1;
  }

  .oc-code-snippet-expand {
    align-self: center;
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    border: none;
    background: none;
    color: var(--text-tertiary);
    cursor: pointer;
    border-radius: var(--oc-radius);
    transition: color 0.12s ease;
  }
  .oc-code-snippet-expand:hover {
    color: var(--text-primary);
  }
  .oc-code-snippet-expand:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  .oc-snippet-copy {
    align-self: center;
    flex: 0 0 auto;
  }
`;
