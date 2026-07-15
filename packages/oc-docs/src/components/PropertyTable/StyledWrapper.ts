import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
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

  .property-box {
    margin: 0;
    border-radius: var(--oc-radius);
    background: var(--oc-background-base);
    border: 1px solid var(--border-color);
    overflow: hidden;
  }

  .property-row {
    display: grid;
    grid-template-columns: 8.75rem minmax(0, 1fr);
    align-items: center;
    column-gap: 1.5rem;
    row-gap: 0;
    padding: 0.5rem 0.875rem;
    min-height: 2rem;
  }
  .property-row .description {
    grid-column: 1 / -1;
  }
  .property-row + .property-row {
    border-top: 1px solid var(--border-color);
  }
  &.property-table--no-row-borders .property-row + .property-row {
    border-top: none;
  }
  &.property-table--no-row-borders .property-box {
    border: none;
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
  }
  .property-value-line {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    min-width: 0;
  }
  .property-value-main {
    min-width: 0;
    flex: 0 1 auto;
    color: var(--oc-colors-text-subtext2);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .property-type {
    flex-shrink: 0;
    font-family: var(--font-sans);
    font-size: 0.6875rem;
    line-height: 1.2;
    color: var(--text-muted);
  }
  .property-value-cell .secret-value-text {
    font-family: inherit;
  }
`;
