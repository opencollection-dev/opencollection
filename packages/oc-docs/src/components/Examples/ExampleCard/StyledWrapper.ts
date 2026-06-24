import styled from '@emotion/styled';

export const statusToneColor = (status?: number): string => {
  if (status === undefined) return 'var(--text-muted)';
  if (status >= 200 && status < 300) return 'var(--oc-status-success-text)';
  if (status >= 400) return 'var(--oc-status-danger-text)';
  return 'var(--oc-status-info-text)';
};

export const StyledWrapper = styled.div`
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  background: var(--oc-background-base);

  & + & {
    margin-top: 12px;
  }

  .oc-example-summary {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
  }

  .oc-example-toggle {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0;
    margin: 0;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    color: inherit;
    font: inherit;
  }
  .oc-example-toggle:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    border-radius: 4px;
  }

  .oc-example-chevron {
    flex: 0 0 auto;
    color: var(--text-muted);
    transition: transform 0.15s ease;
  }
  .oc-example-chevron.is-open {
    transform: rotate(90deg);
  }

  .oc-example-status {
    flex: 0 0 auto;
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    border-radius: 4px;
    padding: 2px 6px;
  }

  .oc-example-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .oc-example-try {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 24px;
    padding: 0 9px;
    box-sizing: border-box;
    background: var(--brand-soft);
    color: var(--primary-text);
    border: 1px solid var(--primary-color);
    border-radius: 6px;
    font-family: var(--font-sans);
    font-size: 11.5px;
    font-weight: 600;
    cursor: pointer;
  }
  .oc-example-try:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  .oc-example-detail {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.22s ease;
  }
  .oc-example-detail.is-open {
    grid-template-rows: 1fr;
  }
  .oc-example-detail-clip {
    overflow: hidden;
    min-height: 0;
  }
  .oc-example-description {
    margin: 0;
    padding: 0.5rem;
    font-family: var(--font-sans);
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1;
    letter-spacing: 0;
    color: #555555;
  }

  .oc-example-url-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
  }
  .oc-example-url-text {
    flex: 1;
    font-family: var(--font-sans);
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1;
    letter-spacing: 0;
    color: #555555;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .oc-example-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .oc-example-pane-left,
  .oc-example-pane-right {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .oc-example-pane-left {
    border-right: 1px solid var(--border-color);
  }

  @media (max-width: 900px) {
    .oc-example-grid {
      grid-template-columns: 1fr;
    }
    .oc-example-pane-left {
      border-right: none;
      border-bottom: 1px solid var(--border-color);
    }
  }

  .oc-pane-head {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 38px;
    padding: 0 10px;
    background: var(--oc-background-mantle);
    border-bottom: 1px solid var(--border-color);
  }

  .oc-pane-title {
    flex: 0 0 auto;
    font-family: var(--font-sans);
    font-weight: 600;
    font-size: 0.6875rem;
    line-height: 1;
    letter-spacing: 0;
    color: #343434;
  }

  .oc-pane-spacer {
    flex: 1;
  }

  .oc-pane-ctype {
    flex: 0 0 auto;
    font-size: 11px;
    color: var(--text-muted);
    font-family: var(--font-mono);
    white-space: nowrap;
  }

  .oc-pane-meta {
    flex: 0 0 auto;
    font-size: 11px;
    color: var(--text-muted);
    font-family: var(--font-mono);
    white-space: nowrap;
  }
  .oc-pane-meta-status {
    font-weight: 700;
  }

  .oc-pane-tabs {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 0 1 auto;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .oc-pane-tabs::-webkit-scrollbar {
    display: none;
  }

  .oc-pane-tab {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    font-size: 11.5px;
    padding: 3px 9px;
    border-radius: 4px;
    background: transparent;
    font: inherit;
    font-size: 11.5px;
    line-height: 1;
    font-weight: 500;
    color: var(--text-muted);
    border: 1px solid transparent;
  }
  .oc-pane-tab.is-active {
    font-weight: 600;
    color: var(--text-primary);
    border: 1px solid var(--border-strong);
    background: var(--oc-background-base);
  }
  .oc-pane-tab-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--primary-color);
    display: inline-block;
  }

  .oc-pane-body {
    flex: 1;
    min-height: 96px;
    max-height: 20rem;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: var(--oc-scrollbar-color) transparent;
  }
  .oc-pane-body::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .oc-pane-body::-webkit-scrollbar-thumb {
    background-color: var(--oc-scrollbar-color);
    border-radius: 3px;
  }
  .oc-pane-body::-webkit-scrollbar-track {
    background: transparent;
  }
  /* Content sits flush inside the pane — the pane frames it, so the inner code
     panel and property table drop their own borders. */
  .oc-pane-body .code-content-wrapper {
    border: none;
    border-radius: 0;
  }
  .oc-pane-body .property-box {
    box-shadow: none;
    border-radius: 0;
  }

  .oc-pane-empty {
    margin: 0;
    padding: 12px;
    font-style: italic;
    font-size: 12px;
    color: var(--text-tertiary);
  }

  @media (max-width: 600px) {
    .oc-pane-ctype {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .oc-example-detail {
      transition: none;
    }
    .oc-example-chevron {
      transition: none;
    }
  }
`;
