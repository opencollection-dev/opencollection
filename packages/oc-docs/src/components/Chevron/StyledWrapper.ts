import styled from '@emotion/styled';

/**
 * A chevron icon that points right and rotates to point down when `.is-open`.
 * Inherits its colour from the surrounding text (stroke: currentColor).
 */
export const ChevronIcon = styled.svg`
  flex-shrink: 0;
  transition: transform 0.2s ease;

  &.is-open {
    transform: rotate(90deg);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
