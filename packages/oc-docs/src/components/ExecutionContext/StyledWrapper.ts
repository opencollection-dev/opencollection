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

  /* Read-only execution-flow chip in the Scripts header (reflects extensions.config.scripts.flow). */
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
     <Collapse>; here we only set its indent. The grey, borderless surface comes from
     the <Code surface="muted"> prop, so the styling lives with the Code component. */
  .oc-script-code-inner {
    padding: 0 1rem 0.875rem 3.5rem;
  }
  /* Test code panel (inside a shared <Collapse>); padding lives on the clip child. */
  .oc-test-code {
    padding: 0 16px 14px;
  }

  @media (max-width: 600px) {
    /* Tighter rows so the number, label and "view code" action fit narrow screens. */
    .oc-script-line {
      gap: 0.5rem;
      padding: 0.625rem 0.75rem;
    }
    /* Let long labels and URLs wrap instead of forcing horizontal overflow. */
    .oc-script-step-label,
    .oc-script-http-url {
      white-space: normal;
      overflow-wrap: anywhere;
    }
    /* Let the HTTP marker's URL drop below the "HTTP" label when space is tight. */
    .oc-script-http-main {
      flex-wrap: wrap;
      column-gap: 0.5rem;
    }
    /* Align the revealed code with the row instead of the deep desktop indent. */
    .oc-script-code-inner {
      padding: 0 0.75rem 0.75rem 0.75rem;
    }
  }

  /* ----- Variables card body ----- */
  .oc-vars-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    padding: 14px 16px;
  }
  /* PRE-REQUEST / POST RESPONSE label floats above its value box, via the shared
     SubHeading (the #9B9B9B group title); we only add the panel's uppercase styling. */
  .oc-vars-field-label {
    text-transform: uppercase;
  }
  /* The empty "None." state is boxed to match a single populated row, so the two
     Variables columns are the same size. Mirrors .property-box + one .property-row. */
  .oc-vars-table .property-empty-message {
    display: flex;
    align-items: center;
    min-height: 2rem;
    padding: 0.5rem 0.875rem;
    border-radius: var(--oc-radius);
    background: var(--oc-background-base);
    box-shadow: inset 0 0 0 1px var(--border-color);
    color: var(--text-tertiary);
  }

  /* Variables has its own per-column value boxes, so its card drops the outer frame
     (border + fill) to avoid a box-in-a-box — the inner boxes stay put. */
  .oc-exec-card-box.oc-exec-card-box--bare {
    border: none;
    background: transparent;
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
    color: #6a4ab5;
    background: #6a4ab51a;
  }
  .oc-scope-tag--collection {
    color: var(--oc-status-warning-text);
    background: color-mix(in srgb, var(--oc-status-warning-text) 12%, transparent);
  }
`;
