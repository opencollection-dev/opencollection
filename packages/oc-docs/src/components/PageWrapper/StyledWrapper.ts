import styled from '@emotion/styled';

/**
 * Shared responsive page container — the single place every page's width and
 * gutters are defined, so pages stay mobile-friendly without per-page media queries:
 *  - Caps content at 1200px and centres it (`margin-inline: auto`), so on viewports
 *    wider than 1200px the page sits centred rather than hugging the left.
 *  - Fluid below 1200px, with 56px (3.5rem) side gutters tightening to 20px (1.25rem)
 *    under 768px so content stays readable without horizontal overflow.
 * Every page renders inside this, so the behaviour applies consistently app-wide.
 */
export const PageWrapperContainer = styled.div`
  max-width: 1200px;
  margin-inline: auto;
  padding: 0.9375rem 3.5rem;

  @media (max-width: 768px) {
    padding: 0.9375rem 1.25rem;
  }
`;
