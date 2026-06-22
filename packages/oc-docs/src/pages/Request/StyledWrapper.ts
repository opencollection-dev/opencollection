import styled from '@emotion/styled';

/**
 * Layout for the request detail page. Pure Emotion styled-component driven by the
 * docs theme CSS variables, so it stays portable if extracted into a package.
 * Content styling lives in the individual components; this owns page-level layout.
 *
 * Matches the finalized design: 1280px centred content, a 1.25fr / 1fr two-column
 * body (request details left, code snippet right) with a 44px gutter and a sticky
 * code rail, and full-width Examples / Execution-context sections below it.
 */
export const RequestWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  color: var(--text-primary);
  /* + PageWrapper's 15px ≈ 40px above the breadcrumb / 56px below (design gutters). */
  padding-top: 1.5625rem;
  padding-bottom: 2.5625rem;

  /* Two-column body: request details on the left (wider), code snippet on the right. */
  .request-body {
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
    gap: 2.75rem;
    align-items: start;
    margin-top: 1.25rem;
  }

  .request-col-left {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Code snippet rail sticks while the longer left column scrolls past it. */
  .request-col-right {
    min-width: 0;
    position: sticky;
    top: 1.25rem;
    align-self: start;
  }

  /* Sections that span the full content width below the two-column body. Each is
     separated from what precedes it (the body, then Examples, then Execution
     Context) by a full-width divider. */
  .request-fullwidth {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color);
  }

  @media (max-width: 1024px) {
    .request-body {
      grid-template-columns: 1fr;
      gap: 1.75rem;
    }
    .request-col-right {
      position: static;
    }
  }
`;
