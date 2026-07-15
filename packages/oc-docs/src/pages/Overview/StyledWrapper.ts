import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  color: var(--text-primary);
  padding-bottom: 2rem;

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
    margin-top: 1.25rem;
  }

  .overview-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color);
  }

  .overview-col-left {
    gap: 1.5rem;
    display: flex;
    flex-direction: column;
  }

  .overview-markdown {
    margin-top: 0.25rem;
  }

  [data-testid='overview-section-label'] > [data-testid='section-label'] {
    color: var(--text-muted);
  }
  .overview-col-right [data-testid='overview-section-label'] > [data-testid='section-label'] {
    margin-bottom: 1rem;
  }
`;
