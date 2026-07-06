import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  text-align: left;

  .var-info-header {
    display: flex;
    align-items: center;
    margin-bottom: 0.375rem;
    gap: 0.375rem;
  }

  .var-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  .var-scope-badge {
    flex-shrink: 0;
    display: inline-block;
    padding: 0.125rem 0.375rem;
    background: var(--brand-soft);
    border: 1px solid color-mix(in srgb, var(--primary-color) 8%, transparent);
    border-radius: var(--oc-radius);
    font-size: 0.6875rem;
    letter-spacing: 0.03125rem;
    color: var(--primary-color);
  }

  .var-value-container {
    position: relative;
    min-width: 17.3125rem;
    max-height: 13.1875rem;
    overflow-y: auto;
    overflow-x: hidden;
    border: 1px solid var(--border-strong);
    border-radius: var(--oc-radius);
    background: var(--oc-background-surface0);
  }

  .var-value-display {
    padding: 0.25rem 1.625rem 0.25rem 0.5rem;
    min-height: 1.5rem;
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    font-weight: 400;
    line-height: 1.25rem;
    color: var(--text-primary);
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }

  .var-copy {
    position: absolute;
    top: 0.25rem;
    right: 0.375rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 1.25rem;
    padding: 0;
    border: none;
    background: transparent;
    font-size: 0.8125rem;
    line-height: 1;
    color: var(--text-muted);
  }

  .var-copy:hover {
    background: transparent;
    color: var(--text-primary);
  }

  .var-warning-note {
    font-size: 0.8125rem;
    color: var(--text-muted);
  }
`;
