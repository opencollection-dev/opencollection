import styled from '@emotion/styled';

export const StyledWrapper = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-left: 0.25rem;
  border: none;
  background: transparent;
  color: inherit;
  cursor: help;
  vertical-align: middle;

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }

  &:focus-visible {
    outline: 0.125rem solid var(--primary-color);
    outline-offset: 0.0625rem;
    border-radius: 50%;
  }
`;
