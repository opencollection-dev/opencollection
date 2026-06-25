import styled from '@emotion/styled';

export const StyledWrapper = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  flex: none;
  background: transparent;
  color: var(--oc-text);
  border: none;
  border-radius: var(--oc-border-radius-base);
  cursor: pointer;
  transition: background-color 0.12s ease, color 0.12s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: var(--oc-background-surface0);
    color: var(--oc-text);
  }

  &[aria-expanded='true'] {
    background: var(--oc-background-surface0);
    color: var(--oc-text);
  }
`;
