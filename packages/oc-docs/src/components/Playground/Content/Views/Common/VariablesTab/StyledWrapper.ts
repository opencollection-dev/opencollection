import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  .title {
    color: var(--text-primary);
  }

  .description {
    color: var(--text-secondary);
  }

  .vars-section + .vars-section {
    margin-top: 1.25rem;
  }

  .vars-section-title {
    margin: 0 0 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0;
    color: var(--oc-colors-text-subtext2);
  }

  .expr-header {
    display: inline-flex;
    align-items: center;
  }

  .var-type {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .var-type-warning {
    display: inline-flex;
    align-items: center;
    color: var(--oc-status-warning-text);
  }

  .var-type-warning svg {
    width: 1rem;
    height: 1rem;
  }

  .var-type-control {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--oc-colors-text-subtext0);
    cursor: pointer;
  }

  .var-type-label {
    font-family: inherit;
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0;
  }

  .var-type-caret {
    display: inline-flex;
    flex: none;
    width: 0.625rem;
    height: 0.625rem;
  }
`;
