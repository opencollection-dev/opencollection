import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;

  .error-title {
    margin: 0;
    color: var(--text-primary);
  }

  .error-retry {
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text-primary);
    background-color: var(--bg-secondary);
    border: 0.0625rem solid var(--border-color);
    border-radius: 0.375rem;
    cursor: pointer;
  }
`;
