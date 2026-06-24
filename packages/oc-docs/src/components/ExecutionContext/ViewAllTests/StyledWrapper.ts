import styled from '@emotion/styled';

export const StyledWrapper = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-muted);

  &:hover {
    text-decoration: underline;
  }
  &:focus-visible {
    outline: 2px solid var(--oc-status-info-text);
    outline-offset: 0.125rem;
    border-radius: 0.25rem;
  }
`;
