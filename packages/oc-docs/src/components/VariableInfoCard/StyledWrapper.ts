import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  box-sizing: border-box;
  min-width: 18.1875rem;
  max-width: 18.1875rem;
  margin: 0;
  padding: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  line-height: 1.25rem;
  color: var(--text-primary);
  background: var(--bg-primary);
  border: 0.0625rem solid var(--border-color);
  border-radius: var(--oc-radius);
  box-shadow: var(--shadow-md);

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
    font-weight: 500;
    color: var(--text-primary);
  }

  .var-scope-badge {
    flex-shrink: 0;
    display: inline-block;
    padding: 0.125rem 0.375rem;
    font-size: 0.6875rem;
    letter-spacing: 0.03125rem;
    color: var(--primary-color);
    background: var(--brand-soft);
    border: 0.0625rem solid color-mix(in srgb, var(--primary-color) 8%, transparent);
    border-radius: var(--oc-radius);
  }

  .var-value-container {
    position: relative;
    max-height: 13.1875rem;
    overflow-y: auto;
    overflow-x: hidden;
    background: var(--bg-secondary);
    border: 0.0625rem solid var(--border-strong);
    border-radius: var(--oc-radius);
  }

  .var-value-display {
    min-height: 1.75rem;
    padding: 0.375rem 1.5rem 0.375rem 0.5rem;
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    font-weight: 400;
    line-height: 1.25rem;
    color: var(--text-primary);
    word-break: break-all;
    overflow-wrap: break-word;
    white-space: pre-wrap;
  }

  .var-icons {
    position: absolute;
    top: 0.375rem;
    right: 0.5rem;
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
