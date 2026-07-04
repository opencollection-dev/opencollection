import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  color: var(--text-primary);
  padding-bottom: 2rem;

  .folder-header {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    margin-top: 0.875rem;
  }

  .folder-header-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 0.625rem;
    background: var(--oc-background-mantle);
    color: var(--text-secondary);
    flex-shrink: 0;
  }
  .folder-header-icon svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .folder-header-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.375rem;
    min-width: 0;
  }

  .folder-header-count {
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    background: var(--oc-background-surface0);
    font-family: var(--font-sans);
    font-weight: 700;
    font-size: 0.75rem;
    line-height: 1;
    letter-spacing: 0;
    color: var(--oc-colors-text-subtext1);
  }

  .folder-fullwidth {
    margin-top: 1.5rem;
  }
`;
