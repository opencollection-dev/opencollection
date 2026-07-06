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
`;
