import styled from '@emotion/styled';

/**
 * Dashed placeholder card for an empty section: a circular icon badge stacked
 * above a heading and a supporting subheading, all centered. Styling is driven
 * entirely by the docs theme variables so it stays portable across pages.
 */
export const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 16rem;
  padding: 2.5rem 2rem;
  border: 1px dashed var(--border-color);
  border-radius: var(--oc-radius);

  .empty-state-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    margin-bottom: 1.25rem;
    border-radius: 50%;
    background: var(--oc-border-border0);
    color: var(--text-tertiary);
  }

  .empty-state-heading {
    margin: 0 0 0.5rem 0;
    font-family: var(--font-sans);
    font-weight: 600;
    font-size: 0.9375rem;
    line-height: 1.3;
    color: var(--text-primary);
  }

  .empty-state-subheading {
    margin: 0;
    max-width: 22rem;
    font-family: var(--font-sans);
    font-weight: 400;
    font-size: 0.8125rem;
    line-height: 1.5;
    color: var(--text-secondary);
  }
`;
