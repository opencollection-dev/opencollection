import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  box-sizing: border-box;
  width: 18.1875rem;
  max-width: calc(100vw - 1rem);
  margin: 0;
  padding: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  line-height: 1.25rem;
  color: var(--text-primary);
  background: var(--bg-primary);
  border: 0.0625rem solid var(--border-color);
  border-radius: var(--oc-radius);

  * {
    box-sizing: border-box;
  }

  .var-info-header {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-bottom: 0.375rem;
  }

  .var-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
    font-size: 0.8125rem;
    line-height: 1;
    color: var(--text-primary);
  }

  .var-scope-badge {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    height: 1.1875rem;
    padding: 0 0.375rem;
    font-weight: 500;
    font-size: 0.75rem;
    line-height: 1;
    letter-spacing: 0.03125rem;
    color: var(--primary-color);
    background: var(--brand-soft);
    border: 0.0625rem solid color-mix(in srgb, var(--primary-color) 8%, transparent);
    border-radius: 0.25rem;
  }

  .var-value-container {
    position: relative;
    height: 2.25rem;
    padding: 0.5rem;
    overflow-y: auto;
    overflow-x: hidden;
    background: var(--oc-background-surface-bright);
    border: none;
    border-radius: var(--oc-radius);
  }

  .var-value-display {
    padding-right: 1.5rem;
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    font-weight: 400;
    line-height: 1.25rem;
    color: var(--text-primary);
    word-break: break-all;
    overflow-wrap: break-word;
    white-space: pre-wrap;
  }

  .var-value-placeholder {
    font-style: italic;
    color: var(--text-tertiary);
  }

  .var-icons {
    position: absolute;
    top: 50%;
    right: 0.5rem;
    transform: translateY(-50%);
    display: flex;
    gap: 0.25rem;
    z-index: 1;
  }

  .var-icons svg {
    width: 1em;
    height: 1em;
  }

  .var-icons .secret-toggle-button,
  .var-icons .copy-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.125rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
    background: transparent;
    border: none;
    border-radius: var(--oc-radius);
    opacity: 0.7;
    cursor: pointer;
    transition: opacity 0.15s ease, color 0.15s ease;
  }

  .var-icons .secret-toggle-button:hover,
  .var-icons .copy-button:hover {
    opacity: 1;
    color: var(--text-primary);
    background: transparent;
  }

  .var-icons .copy-button:focus-visible,
  .var-icons .secret-toggle-button:focus-visible {
    outline: 0.125rem solid var(--primary-color);
    outline-offset: 0.0625rem;
  }

  .var-readonly-note {
    margin-top: 0.25rem;
    font-size: 0.6875rem;
    color: var(--text-muted);
    opacity: 0.6;
  }

  .var-warning-note {
    margin-top: 0.375rem;
    font-size: 0.75rem;
    line-height: 1.25rem;
    color: var(--oc-status-danger-text);
  }
`;
