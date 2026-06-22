import styled from '@emotion/styled';

export const ExecutionContextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* ----- Section card (static; the whole Execution Context collapses as one) ----- */
  .oc-exec-card {
    border: 1px solid var(--border-color);
    border-radius: 0.625rem;
    overflow: hidden;
    background: var(--oc-background-base);
  }

  .oc-exec-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem 0.75rem;
    padding: 0.5rem 0.5rem;
    border-bottom: 1px solid var(--border-color);
  }
  .oc-exec-card-title {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  .oc-exec-card-meta {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  /* ----- Execution-flow pill (toggles sandwich ⇄ sequential) ----- */
  .oc-flow-toggle {
    appearance: none;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: 0.6875rem;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0;
    color: #838383;
    background: var(--oc-background-surface0);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    padding: 0.125rem 0.25rem;
    white-space: nowrap;
    transition: color 0.15s ease, border-color 0.15s ease;
  }
  .oc-flow-toggle:hover {
    color: var(--text-primary);
    border-color: var(--border-strong);
  }
  .oc-flow-toggle:focus-visible {
    outline: 2px solid var(--oc-status-info-text);
    outline-offset: 0.0625rem;
  }

  /* ----- Script chain ----- */
  /* The chain has a single divider, sitting above the HTTP execution marker. */
  .oc-script-row--marker {
    border-top: 1px solid var(--oc-border-border0);
  }

  /* Shared row grid so every row aligns: num | chevron | label | description | action. */
  .oc-script-line {
    display: grid;
    grid-template-columns: 1.25rem 0.875rem minmax(5rem, 15rem) minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
  }

  .oc-step-num {
    justify-self: end;
    font-family: var(--font-mono);
    font-size: 0.71875rem;
    color: var(--text-muted);
  }

  .oc-script-step-head {
    cursor: pointer;
  }
  .oc-script-step-head:focus-visible {
    outline: 2px solid var(--oc-status-info-text);
    outline-offset: -2px;
    border-radius: 0.375rem;
  }

  /* Rotation/transition are owned by the shared Chevron; we only set its colour. */
  .oc-script-chevron {
    color: var(--text-muted);
  }

  .oc-script-label-cell {
    display: inline-flex;
    align-items: baseline;
    gap: 0.5rem;
    min-width: 0;
  }
  .oc-script-step-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }
  .oc-script-inherited-tag {
    font-size: 0.65625rem;
    font-weight: 400;
    color: var(--text-muted);
    white-space: nowrap;
  }

  .oc-script-desc {
    font-family: var(--font-sans);
    font-size: 0.75rem;
    color: var(--text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* HTTP execution marker — same grid; its chevron + action cells stay empty. */
  .oc-script-http-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--primary-text);
  }
  .oc-script-http-url {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* "view code" / "hide code" text button */
  .oc-code-toggle {
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
  .oc-code-toggle:hover {
    text-decoration: underline;
  }
  .oc-code-toggle:focus-visible {
    outline: 2px solid var(--oc-status-info-text);
    outline-offset: 0.125rem;
    border-radius: 0.25rem;
  }

  /* Expanded code (height animation; indented past the num + chevron columns). */
  .oc-script-code {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.22s ease;
  }
  .oc-script-code.is-open {
    grid-template-rows: 1fr;
  }
  .oc-script-code-clip {
    overflow: hidden;
    min-height: 0;
  }
  .oc-script-code-inner {
    padding: 0 1rem 0.875rem 3.5rem;
  }

  @media (max-width: 600px) {
    /* Stack each row so nothing overlaps: number + chevron + label (+ action) on
       the first line, the description/url wrapping full-width beneath. */
    .oc-script-line {
      grid-template-columns: 1.25rem 0.875rem minmax(0, 1fr) auto;
      grid-template-areas:
        'num chevron label  action'
        'num chevron desc   desc';
      row-gap: 0.25rem;
    }
    .oc-script-line > :nth-child(1) {
      grid-area: num;
    }
    .oc-script-line > :nth-child(2) {
      grid-area: chevron;
    }
    .oc-script-line > :nth-child(3) {
      grid-area: label;
    }
    .oc-script-line > :nth-child(4) {
      grid-area: desc;
    }
    .oc-script-line > :nth-child(5) {
      grid-area: action;
    }
    .oc-script-label-cell {
      flex-wrap: wrap;
    }
    .oc-script-step-label,
    .oc-script-desc,
    .oc-script-http-url {
      white-space: normal;
      overflow-wrap: anywhere;
    }
    .oc-script-code-inner {
      padding: 0 1rem 0.875rem 1rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .oc-script-code {
      transition: none;
    }
  }

  /* ----- Variables card body ----- */
  .oc-vars-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    padding: 14px 16px;
  }
  .oc-vars-field-label {
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 6px;
  }
  .oc-vars-none {
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 12px;
    color: var(--text-tertiary);
    font-style: italic;
  }

  @media (max-width: 900px) {
    .oc-vars-grid {
      grid-template-columns: 1fr;
    }
  }

  /* ----- Asserts card body ----- */
  .oc-assert-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 16px;
  }
  .oc-assert-row + .oc-assert-row {
    border-top: 1px solid var(--oc-border-border0);
  }
  .oc-assert-row.is-disabled {
    opacity: 0.55;
  }
  .oc-assert-expr {
    font-family: var(--font-mono);
    font-size: 12.5px;
    color: var(--text-primary);
  }

  /* ----- Tests card body ----- */
  .oc-test-row + .oc-test-row {
    border-top: 1px solid var(--oc-border-border0);
  }
  .oc-test-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 16px;
    cursor: pointer;
  }
  .oc-test-name {
    font-family: var(--font-mono);
    font-size: 12.5px;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .oc-test-spacer {
    flex: 1;
  }

  /* ----- ScopeTag pill ----- */
  .oc-scope-tag {
    font-family: var(--font-mono);
    font-size: 10.5px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 4px;
    flex-shrink: 0;
  }
  .oc-scope-tag--request {
    color: var(--oc-status-info-text);
    background: color-mix(in srgb, var(--oc-status-info-text) 12%, transparent);
  }
  .oc-scope-tag--folder {
    color: var(--oc-request-methods-head);
    background: color-mix(in srgb, var(--oc-request-methods-head) 12%, transparent);
  }
  .oc-scope-tag--collection {
    color: var(--oc-status-warning-text);
    background: color-mix(in srgb, var(--oc-status-warning-text) 12%, transparent);
  }
`;
