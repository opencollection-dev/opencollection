import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  max-width: 100rem;
  margin: 0 auto;
  color: var(--text-primary);
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;

  .request-columns {
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
    gap: 2.75rem;
    align-items: start;
    margin-top: 1.5rem;
  }

  .request-col-left {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .request-col-right {
    min-width: 0;
    position: sticky;
    top: 1.25rem;
    align-self: start;
  }

  .request-fullwidth {
    margin-top: 2rem;
    padding-top: 2rem;
  }

  @container docs (max-width: 1024px) {
    .request-columns {
      grid-template-columns: 1fr;
      gap: 1.75rem;
    }
    .request-col-right {
      position: static;
    }
  }
`;
