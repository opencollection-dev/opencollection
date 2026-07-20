import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;

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
