import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--oc-radius);
  background-color: var(--oc-background-mantle);

  .request-url-bar-method {
    flex-shrink: 0;
  }
  .request-url-bar-method .method-badge {
    font-size: 0.75rem;
    line-height: 1.125rem;
    letter-spacing: 0.04em;
    min-width: unset;
    padding: 0;
  }

  .request-url-bar-url {
    flex: 1;
    min-width: 0;
    font-family: var(--font-mono);
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1.125rem;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .request-url-bar-actions {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .request-try {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.3125rem;
    height: 1.5rem;
    padding: 0 0.5625rem;
    border: 1px solid var(--oc-brand);
    border-radius: var(--oc-radius);
    background-color: var(--oc-brand);
    color: var(--oc-background-base);
    font-family: var(--font-sans);
    font-weight: 600;
    font-size: 0.71875rem;
    line-height: 1;
    letter-spacing: 0;
    white-space: nowrap;
    cursor: pointer;
  }
  .request-try:hover {
    opacity: 0.92;
  }
  .request-try:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
`;
