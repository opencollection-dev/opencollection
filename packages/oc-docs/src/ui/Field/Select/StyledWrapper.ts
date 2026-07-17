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
  border: 1px solid var(--oc-border-border0);
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
`;
