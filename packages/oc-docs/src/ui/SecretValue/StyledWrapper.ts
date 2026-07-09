import styled from '@emotion/styled';

export const StyledWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  &.secret-value--start {
    justify-content: flex-start;
    gap: 0.7rem;
  }

  .secret-value-text {
    font-family: var(--font-mono);
    color: var(--text-primary);
    word-break: break-all;
  }

  .secret-value-input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--text-primary);
    font: inherit;
    font-family: var(--font-mono);
    padding: 0;
  }

  &.secret-value--readonly .secret-value-text {
    color: var(--text-tertiary);
  }

  .secret-value-toggle {
    display: inline-flex;
    align-items: center;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-tertiary);
    flex-shrink: 0;
  }
  .secret-value-toggle:hover {
    color: var(--text-secondary);
  }

  .secret-value-icon {
    display: inline-flex;
    align-items: center;
    color: var(--text-tertiary);
    flex-shrink: 0;
  }
`;
