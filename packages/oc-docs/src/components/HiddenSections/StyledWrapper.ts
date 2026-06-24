import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;

  .oc-hidden-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    width: fit-content;
    margin: 0;
    padding: 0.25rem 0.4rem;
    background: var(--oc-background-crust);
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: 0.78125rem;
    line-height: 1;
    color: var(--text-muted);
    transition: color 0.12s ease;
  }
  .oc-hidden-toggle svg {
    flex-shrink: 0;
  }
  .oc-hidden-toggle:hover {
    color: var(--text-secondary);
  }
  .oc-hidden-toggle:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  .oc-hidden-item-title {
    font-family: var(--font-sans);
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    line-height: 1;
    text-transform: uppercase;
    color: var(--text-primary);
    margin-bottom: 0.375rem;
  }
  .oc-hidden-item-box {
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 0.5rem 0.875rem;
    font-family: var(--font-sans);
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1.2;
    letter-spacing: normal;
    color: var(--text-tertiary);
  }
`;
