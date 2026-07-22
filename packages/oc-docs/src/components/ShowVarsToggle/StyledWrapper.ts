import styled from '@emotion/styled';

export const StyledWrapper = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex: none;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: 0.75rem;
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
    width: 1.875rem;
    height: 1rem;
    flex: none;
    border-radius: 999px;
    background: var(--oc-border-border2);
    transition: background-color 0.16s ease;
  }

  .show-vars-thumb {
    position: absolute;
    top: 0.125rem;
    left: 0.125rem;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    background: var(--oc-background-base);
    transition: transform 0.16s ease;
  }

  &[aria-checked='true'] .show-vars-track {
    background: var(--oc-brand);
  }

  &[aria-checked='true'] .show-vars-thumb {
    transform: translateX(0.875rem);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--oc-brand);
    outline-offset: 0.125rem;
    border-radius: var(--oc-border-radius-base);
  }
`;
