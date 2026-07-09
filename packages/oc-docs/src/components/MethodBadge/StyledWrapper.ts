import styled from '@emotion/styled';

export const StyledWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;

  &.pill {
    padding: 0.125rem 0.5rem;
    border-radius: var(--oc-radius);
    background-color: color-mix(in srgb, currentColor 12%, transparent);
  }
`;
