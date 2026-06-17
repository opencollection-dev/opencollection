import styled from '@emotion/styled';

export const CollectionConfigurationWrapper = styled.div`
  .config-group + .config-group {
    margin-top: 1.75rem;
  }

  .config-empty-message {
    margin: 0;
    font-family: var(--font-sans);
    font-weight: 500;
    font-style: italic;
    font-size: 0.8125rem;
    line-height: 1;
    letter-spacing: normal;
    color: var(--text-secondary);
  }

  .config-box {
    margin: 0;
    border: 1px solid var(--border-color);
    border-radius: var(--oc-radius);
    overflow: hidden;
  }

  .config-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.375rem 0.5rem;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.8125rem;
    min-height: 2.25rem;
  }
  .config-row:last-child {
    border-bottom: none;
  }

  .config-key {
    font-family: var(--font-sans);
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1;
    letter-spacing: normal;
    color: var(--text-secondary);
    min-width: 7rem;
    flex-shrink: 0;
  }
  .config-value-cell {
    margin: 0;
    flex: 1;
    min-width: 0;
    /* Single source of truth for value typography — every value rendered in the
       cell (plain, variable, muted, and the masked SecretValue) inherits it. */
    font-family: 'Fira Code', var(--font-mono);
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1;
    letter-spacing: normal;
    color: var(--text-primary);
  }
  .config-value {
    word-break: break-all;
  }
  .config-value--var {
    color: var(--primary-color);
  }
  /* SecretValue defaults to the app mono token; re-point it to the cell's font
     so secret values match the rest of the section (size/weight inherit). The
     descendant selector keeps specificity above SecretValue's own rule. */
  .config-value-cell .secret-value-text {
    font-family: inherit;
  }

  .script-block + .script-block {
    margin-top: 1rem;
  }
  .script-label {
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: 0.625rem;
    line-height: 1;
    letter-spacing: 0.0525rem;
    color: var(--text-tertiary);
    margin: 0 0 0.375rem 0;
  }
`;
