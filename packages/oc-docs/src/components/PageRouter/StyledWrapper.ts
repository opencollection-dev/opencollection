import styled from '@emotion/styled';

/**
 * Structural shell only. Page gutters (max-width + padding) are owned by
 * <PageWrapper>, so the router must not add its own max-width/padding — that
 * would double up the spacing. Keeps the page chrome identical to the pages.
 */
export const StyledWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100%;

  .page-body {
    flex: 1 0 auto;
  }
`;
