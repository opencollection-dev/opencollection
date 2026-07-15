import styled from '@emotion/styled';

export const StyledWrapper = styled.span`
  position: relative;
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 0.25rem;
  padding: 0.34375rem 0.75rem 0.34375rem 0.625rem;
  color: var(--primary-color);
  background-color: var(--bg-primary);
  border: 0.0625rem solid var(--oc-border-border0);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: border-color 0.15s ease;

  .oc-select-label {
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
  }

  .oc-select-caret {
    display: inline-flex;
    flex: none;
    width: 0.75rem;
    height: 0.75rem;
  }

  .oc-select-native {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
    appearance: none;
    -webkit-appearance: none;
    background: transparent;
    color: transparent;
    opacity: 0;
    cursor: inherit;
  }

  .oc-select-native:focus,
  .oc-select-native:focus-visible {
    outline: none;
  }

  .oc-select-native option {
    color: var(--text-primary);
  }
`;
