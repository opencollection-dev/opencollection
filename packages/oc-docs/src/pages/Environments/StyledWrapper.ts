import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  color: var(--text-primary);
  padding-bottom: 2rem;

  .environment-tabs {
    display: flex;
    flex-wrap: nowrap;
    gap: 0.25rem;
    margin-top: 1.25rem;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .environment-tabs::-webkit-scrollbar {
    display: none;
  }

  .environment-tab {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    border: none;
    background: transparent;
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0;
    color: var(--text-secondary);
    white-space: nowrap;
    cursor: pointer;
    transition: background 0.12s ease, color 0.12s ease;
  }
  .environment-tab:hover {
    color: var(--text-primary);
  }
  .environment-tab.is-active {
    color: var(--text-primary);
    font-weight: 600;
    background: color-mix(in srgb, var(--oc-text) 6%, transparent);
  }
  .environment-tab:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  .environment-panel {
    margin-top: 1rem;
  }

  .environment-name {
    font-family: var(--font-sans);
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1;
    letter-spacing: 0;
    color: var(--oc-primary-strong);
  }

  .environment-value {
    font-family: 'Fira Code', var(--font-mono);
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1;
    letter-spacing: 0;
    color: var(--text-primary);
  }

  .environment-empty {
    font-style: italic;
    font-size: 0.75rem;
    color: var(--oc-colors-text-subtext0);
  }

  .environment-secret {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-style: italic;
    font-size: 0.75rem;
    color: var(--oc-colors-text-subtext0);
  }
  .environment-secret svg {
    width: 0.875rem;
    height: 0.875rem;
  }

  .environment-type {
    font-family: var(--font-sans);
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1;
    letter-spacing: 0;
    color: var(--oc-overlay-overlay2);
  }
  .environment-empty {
    margin-top: 0.8rem;
  }
`;
