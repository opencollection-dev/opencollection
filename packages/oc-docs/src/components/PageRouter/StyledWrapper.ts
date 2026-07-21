import styled from '@emotion/styled';

/**
 * Structural shell only. Page gutters (max-width + padding) are owned by
 * <PageWrapper>, so the router must not add its own max-width/padding — that
 * would double up the spacing. Keeps the page chrome identical to the pages.
 *
 * `.page-fill` fills at least the scroll viewport (its `min-height: 100%`
 * resolves against the definite height of the `.appshell-content` scroll
 * parent, mirrored here via `height: 100%`). The attribution footer that
 * follows it therefore always starts just below the fold, so a short page
 * never shows it in the initial viewport — the user scrolls a little to reveal it.
 */
export const StyledWrapper = styled.div`
  box-sizing: border-box;
  height: 100%;

  .page-fill {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  .page-body {
    flex: 1 0 auto;
  }
`;
