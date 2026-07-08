import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--oc-background-surface2);
  border-radius: 7px;
  background-color: var(--oc-background-surface0);

  button {
    width: 26px;
    height: 24px;
    color: var(--text-secondary);
    border-radius: 5px;
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
    color: var(--oc-colors-accent);
    background-color: var(--oc-background-base);
    box-shadow: 0 1px 2px color-mix(in srgb, var(--oc-text) 12%, transparent);
  }
`;
