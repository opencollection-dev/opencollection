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
    margin-top: 1.5rem;
  }

  .overview-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 3rem;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color);
  }

  .overview-col-left {
    gap: 1.5rem;
    display: flex;
    flex-direction: column;
  }

  @container docs (max-width: 1200px) {
    .overview-body {
      grid-template-columns: minmax(0, 1fr);
      gap: 2rem;
    }
  }

  .overview-markdown {
    margin-top: 0.25rem;
  }
`;
