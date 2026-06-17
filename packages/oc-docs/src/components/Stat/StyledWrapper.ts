import styled from '@emotion/styled';

export const StatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .stat-value {
    font-family: var(--font-sans);
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1;
    letter-spacing: normal;
    color: var(--text-primary);
  }

  .stat-label {
    font-family: var(--font-sans);
    font-weight: 400;
    font-size: 0.78125rem;
    line-height: 1;
    letter-spacing: normal;
    color: var(--text-secondary);
  }
`;
