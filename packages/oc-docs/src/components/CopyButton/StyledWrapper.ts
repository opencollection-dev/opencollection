import styled from '@emotion/styled';

export const CopyButtonWrapper = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border: 1px solid var(--border-color);
  border-radius: var(--oc-radius);
  color: var(--text-tertiary);
  background-color: var(--background-light);
  cursor: pointer;
  transition: color 0.15s ease, background-color 0.15s ease;

  &:hover {
    color: var(--text-secondary);
    background-color: var(--badge-bg);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 1px;
  }
`;
