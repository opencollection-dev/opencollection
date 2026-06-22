import styled from '@emotion/styled';

/**
 * Bordered key/value table. The value cell is the single source of truth for value
 * typography (Fira Code 12px); plain values inherit it, secrets re-point their own
 * font to it. Extracted from CollectionConfiguration so it's shared docs-wide.
 */
export const PropertyTableWrapper = styled.div`
  .property-empty-message {
    margin: 0;
    font-family: var(--font-sans);
    font-weight: 500;
    font-style: italic;
    font-size: 0.8125rem;
    line-height: 1;
    letter-spacing: normal;
    color: var(--text-secondary);
  }

  /* Design: soft 1px frame via inset shadow (so row dividers never double up), 6px radius. */
  .property-box {
    margin: 0;
    border-radius: var(--oc-radius);
    background: var(--oc-background-base);
    box-shadow: inset 0 0 0 1px var(--border-color);
    overflow: hidden;
  }

  /* Design: label (140px) | value grid, 24px gutter, 8px/14px padding, divider between rows. */
  .property-row {
    display: grid;
    grid-template-columns: 8.75rem minmax(0, 1fr);
    align-items: center;
    gap: 1.5rem;
    padding: 0.5rem 0.875rem;
    min-height: 2rem;
  }
  .property-row + .property-row {
    border-top: 1px solid var(--border-color);
  }
  .property-row--disabled {
    opacity: 0.55;
  }

  .property-key {
    font-family: var(--font-sans);
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1.2;
    letter-spacing: normal;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .property-value-cell {
    margin: 0;
    min-width: 0;
    font-family: 'Fira Code', var(--font-mono);
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1.2;
    letter-spacing: normal;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* SecretValue defaults to the app mono token; re-point it to the cell's font. */
  .property-value-cell .secret-value-text {
    font-family: inherit;
  }
`;
