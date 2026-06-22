import styled from '@emotion/styled';

/**
 * Code snippet panel. A single bordered box whose header bar holds the language
 * tabs (cURL / Javascript / Python) and the expand control, separated from the
 * code by a divider; the active tab carries a brand underline. The inner `Code`
 * panel renders flush (its own border/radius are dropped). Sizes are in rem so the
 * panel scales with the root font size.
 */
export const CodeSnippetTabsWrapper = styled.div`
  .oc-snippet-box {
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    overflow: hidden;
    background: var(--oc-background-base);
  }

  /* Header bar: tabs on the left, expand on the right, divider below. */
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
    /* Active underline overlaps the header divider (−1px) so it reads as one line. */
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

  /* The code panel sits flush inside the box. */
  .oc-snippet-box .code-content-wrapper {
    border: none;
    border-radius: 0;
  }

  /* Keep the code's copy button always visible in the snippet (matches design). */
  && .code-copy-floating {
    opacity: 1;
  }

  /* Maximize / minimize icon button in the header bar. */
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

  /* Copy control shown in the header when the snippet is in the expanded modal. */
  .oc-snippet-copy {
    align-self: center;
    flex: 0 0 auto;
  }
`;
