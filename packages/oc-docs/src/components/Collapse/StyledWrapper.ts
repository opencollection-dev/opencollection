import styled from '@emotion/styled';

/**
 * Animated disclosure container. Collapsed → `grid-template-rows: 0fr`; open → `1fr`,
 * which animates the panel's height with no fixed max-height or JS measurement. The
 * inner `.oc-collapse-clip` hides the overflow while the track is shorter than its
 * content. Purely presentational — the controlling button/state lives in the caller.
 */
export const CollapseWrapper = styled.div`
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.25s ease;

  &.is-open {
    grid-template-rows: 1fr;
  }

  .oc-collapse-clip {
    overflow: hidden;
    min-height: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
