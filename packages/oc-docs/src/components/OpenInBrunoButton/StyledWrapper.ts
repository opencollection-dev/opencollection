import styled from '@emotion/styled';

export const StyledWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  box-sizing: border-box;
  font-family: var(--font-sans);
  font-size: var(--oc-font-size-sm);
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  color: var(--oc-brand);
  background: var(--oc-background-base);
  border: 1px solid var(--oc-brand);
  border-radius: var(--oc-border-radius-base);
  transition: background-color 0.12s ease, opacity 0.12s ease;

  svg {
    width: 16px;
    height: 16px;
    flex: none;
  }

  &:hover {
    background: color-mix(in srgb, var(--oc-brand) 8%, var(--oc-background-base));
  }

  &.is-full {
    padding: 5px 10px;
  }

  &.is-icon {
    width: 28px;
    padding: 0;
  }
`;
