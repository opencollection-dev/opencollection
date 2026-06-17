import styled from '@emotion/styled';

/**
 * Layout for the collection Overview page. Pure styled-component (Emotion) driven by
 * the docs theme CSS variables, so it stays portable if extracted into a package.
 * Content styling lives in the individual components; this owns page-level layout.
 */
export const OverviewWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  color: var(--text-primary);
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);

  .overview-headline {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }
  .overview-version {
    font-family: var(--font-sans);
    font-size: 0.75rem;
    color: var(--text-tertiary);
    margin-bottom: 0.3rem;
    font-weight: 600;
  }
  .overview-stats-row {
    margin-top: 1.5rem;
  }

  /* The divider lives on the body, so it only appears when there are sections to show. */
  .overview-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 3rem;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color);
  }

  @media (max-width: 1100px) {
    .overview-body {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  .overview-markdown {
    margin-top: 0.25rem;
  }
`;
