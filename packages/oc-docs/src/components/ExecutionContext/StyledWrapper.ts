import styled from '@emotion/styled';

export const ExecutionContextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* ----- Section card: a title row ABOVE a bordered content box ----- */
  .oc-exec-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* Title (+ meta) sits outside the box, not as a header bar inside it. */
  .oc-exec-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem 0.75rem;
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

  /* The bordered box that holds the card's content. */
  .oc-exec-card-box {
    border: 1px solid var(--border-color);
    border-radius: 0.625rem;
    overflow: hidden;
    background: var(--oc-background-base);
  }

  /* Read-only execution-flow chip in the Scripts header (reflects config.scripts.flow). */
  .oc-exec-flow {
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
  }

  /* ----- Script chain ----- */
  /* The chain has a single divider, sitting above the HTTP execution marker. */
  .oc-script-row--marker {
    border-top: 1px solid var(--oc-border-border0);
  }

  /* Shared row grid so every row aligns: num | chevron | label/main | action. */
  .oc-script-line {
    display: grid;
    grid-template-columns: 1.25rem 0.875rem minmax(0, 1fr) auto;
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

  .oc-script-step-label {
    min-width: 0;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* HTTP execution marker — the "HTTP" label and request URL share the main column. */
  .oc-script-http-main {
    display: inline-flex;
    align-items: baseline;
    gap: 0.75rem;
    min-width: 0;
  }
  .oc-script-http-label {
    flex: none;
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

  /* The expanded code panel's open/close height animation is handled by the shared
     <Collapse>; here we only style its inner content (indent, grey surface). */
  /* The Code component paints its surfaces from --oc-background-base, so redefining
     it here puts execution-context script code on a subtle grey panel without
     touching the shared Code component. Uses the mantle surface token, which is
     #F8F8F8 in the light theme (per design) and a matching dark grey in dark — so
     syntax colours stay readable in both. Scoped to the script chain, so the
     Examples / Code Snippet panels elsewhere are unaffected. */
  .oc-script-code-inner {
    padding: 0 1rem 0.875rem 3.5rem;
    --oc-background-base: var(--oc-background-mantle);
  }
  .oc-script-code-inner .code-content-wrapper {
    border-radius: 0.375rem;
  }
  /* Test code panel (inside a shared <Collapse>); padding lives on the clip child. */
  .oc-test-code {
    padding: 0 16px 14px;
  }

  @media (max-width: 600px) {
    /* Let the label and URL wrap instead of overflowing on narrow screens. */
    .oc-script-step-label,
    .oc-script-http-main,
    .oc-script-http-url {
      white-space: normal;
      overflow-wrap: anywhere;
    }
    .oc-script-code-inner {
      padding: 0 1rem 0.875rem 1rem;
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
    font-size: 0.6875rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
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
