import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 1px;
  border: 1px solid var(--oc-border-border0);
  border-radius: var(--oc-radius);
  background-color: var(--oc-background-surface-bright);

  button {
    width: 26px;
    height: 24px;
    color: var(--oc-colors-text-subtext0);
    border-radius: var(--oc-radius);
  }

  button svg {
    width: 14px;
    height: 14px;
  }

  button:hover {
    color: var(--text-primary);
    background-color: var(--oc-background-base);
  }

  button.active {
    color: var(--oc-primary-solid);
    background-color: var(--oc-background-base);
    box-shadow: 0 1px 2px color-mix(in srgb, var(--oc-text) 12%, transparent);
  }
`;
