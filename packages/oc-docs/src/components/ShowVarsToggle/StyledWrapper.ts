import styled from '@emotion/styled';

export const StyledWrapper = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: none;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: color 0.12s ease;

  &:hover {
    color: var(--text-primary);
  }

  @media (max-width: 900px) {
    .show-vars-label {
      display: none;
    }
  }

  .show-vars-track {
    position: relative;
    width: 30px;
    height: 16px;
    flex: none;
    border-radius: 999px;
    background: var(--oc-border-border2);
    transition: background-color 0.16s ease;
  }

  .show-vars-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--oc-background-base);
    transition: transform 0.16s ease;
  }

  &[aria-checked='true'] .show-vars-track {
    background: var(--oc-brand);
  }

  &[aria-checked='true'] .show-vars-thumb {
    transform: translateX(14px);
  }

  &:focus-visible {
    outline: 2px solid var(--oc-brand);
    outline-offset: 2px;
    border-radius: var(--oc-border-radius-base);
  }
`;
