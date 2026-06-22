import styled from '@emotion/styled';

export const StyledWrapper = styled.h1`
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 600;
  color: var(--text-primary);

  &.oc-heading--lg {
    font-size: 1.25rem;
    line-height: 1;
    letter-spacing: -0.5px;
  }

  &.oc-heading--md {
    font-size: 1rem;
    line-height: 1.5rem;
    letter-spacing: 0;
  }
`;
