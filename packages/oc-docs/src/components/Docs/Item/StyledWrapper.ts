import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  width: 100%;
  max-width: 80rem;

  .item-header-minimal {
    margin-bottom: 1.25rem;
  }

  .item-breadcrumb {
    font-size: 0.75rem;
    color: var(--text-tertiary);
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .breadcrumb-sep {
    margin: 0 0.3rem;
    opacity: 0.5;
  }

  .breadcrumb-link {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    cursor: pointer;
    transition: color 0.15s ease;
    border-radius: 3px;
    padding: 0.05rem 0.2rem;
  }

  .breadcrumb-link:hover {
    color: var(--text-secondary);
    background-color: color-mix(in srgb, var(--oc-text) 4%, transparent);
  }

  .breadcrumb-icon {
    flex-shrink: 0;
    opacity: 0.6;
  }

  .item-title-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .item-type-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-family: var(--font-mono);
  }

  .item-type-badge.folder {
    background-color: color-mix(in srgb, var(--oc-colors-text-purple) 10%, transparent);
    color: var(--oc-colors-text-purple);
  }

  .item-type-badge.script {
    background-color: color-mix(in srgb, var(--oc-colors-text-green) 10%, transparent);
    color: var(--oc-colors-text-green);
  }

  .item-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    line-height: 1.3;
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .item-title-icon {
    flex-shrink: 0;
    color: var(--text-tertiary);
  }

  .item-subtitle {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--text-tertiary);
  }

  /* ============================================================
     DOCS / PROSE
     ============================================================ */

  .item-docs {
    max-width: none;
    margin-bottom: 1.5rem;
    font-size: 0.9375rem;
    color: var(--text-secondary);
    line-height: 1.7;
  }

  .item-docs h1 { margin: 0 0 0.75rem; font-size: 1.375rem; font-weight: 600; color: var(--text-primary); letter-spacing: -0.02em; }
  .item-docs h2 { margin: 1rem 0 0.5rem; font-size: 1.125rem; font-weight: 600; color: var(--text-primary); }
  .item-docs h3 { margin: 0.75rem 0 0.375rem; font-size: 1rem; font-weight: 600; color: var(--text-primary); }
  .item-docs p { margin: 0 0 0.75rem; }
  .item-docs a { color: var(--prose-links); text-decoration: none; transition: color 0.15s ease; }
  .item-docs a:hover { color: var(--prose-links-hover); text-decoration: underline; text-underline-offset: 3px; }
  .item-docs code { display: inline-block; padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.85em; font-family: var(--font-mono); background-color: var(--prose-code-bg); color: var(--prose-code-text); }
  .item-docs pre { margin: 0 0 0.75rem; padding: 1rem 1.25rem; border-radius: 8px; overflow-x: auto; background-color: var(--code-bg); color: var(--code-text); }
  .item-docs ul, .item-docs ol { margin: 0 0 0.75rem; padding-left: 1.25rem; }
  .item-docs ul { list-style: disc inside; }
  .item-docs ol { list-style: decimal inside; }
  .item-docs li { margin: 0.2rem 0; }
  .item-docs blockquote { margin: 0.75rem 0; padding: 0.625rem 1rem; border-left: 3px solid var(--prose-blockquote-border); color: var(--text-secondary); background-color: color-mix(in srgb, var(--oc-colors-accent) 4%, transparent); border-radius: 0 6px 6px 0; }

  /* ============================================================
     CONTENT LAYOUT
     ============================================================ */

  .item-content-grid { display: flex; flex-direction: column; gap: 1rem; }
  .item-content-main { display: flex; flex-direction: column; gap: 1.5rem; }
  .request-details { display: flex; flex-direction: column; gap: 1rem; }
  .request-body-section { display: flex; flex-direction: column; gap: 0.375rem; }

  @media (min-width: 1024px) {
    .item-content-main { flex-direction: row; }
    .request-details { flex: 4; min-width: 0; }
    .code-snippets-wrapper { flex: 3; min-width: 0; }
  }

  /* ============================================================
     ENDPOINT BADGES
     ============================================================ */

  .endpoint-badges { display: flex; align-items: stretch; flex-wrap: wrap; }

  .badge-method { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; font-family: var(--font-sans); padding: 0.25rem 0.625rem; display: inline-flex; align-items: center; color: white !important; border-radius: 6px 0 0 6px; }

  .endpoint-url-container {
    display: inline-flex;
    align-items: stretch;
    border-radius: 0 6px 6px 0;
    border: 1px solid var(--border-color);
    border-left: none;
    background-color: var(--oc-background-base);
    overflow: hidden;
  }

  .badge-url { font-size: 0.8125rem; font-family: var(--font-mono); color: var(--text-secondary); font-weight: 400; padding: 0.25rem 0.625rem; display: inline-flex; align-items: center; }
  .badge-try { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.625rem; margin-left: auto; font-size: 0.75rem; font-weight: 500; color: var(--primary-color); background-color: color-mix(in srgb, var(--oc-colors-accent) 6%, transparent); border: none; border-left: 1px solid var(--border-color); cursor: pointer; transition: all 0.15s ease; }
  .badge-try:hover { background-color: color-mix(in srgb, var(--oc-colors-accent) 12%, transparent); }

  /* ============================================================
     SECTION TITLE TABS (Body / Scripts switcher)
     ============================================================ */

  .section-title-tabs {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .section-title-tab {
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    color: var(--text-tertiary);
    transition: color 0.15s ease;
    margin: 0;
    padding-bottom: 2px;
    border-bottom: 1.5px dashed transparent;
  }

  .section-title-tab:hover {
    color: var(--text-secondary);
  }

  .section-title-tab.active {
    color: var(--text-primary);
    border-bottom-color: var(--text-tertiary);
  }
`;
