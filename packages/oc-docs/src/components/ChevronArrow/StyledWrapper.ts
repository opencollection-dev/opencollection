import styled from '@emotion/styled';

export const StyledWrapper = styled.svg`
  flex-shrink: 0;
  transition: transform 0.2s ease;

  &.is-open {
    transform: rotate(90deg);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
