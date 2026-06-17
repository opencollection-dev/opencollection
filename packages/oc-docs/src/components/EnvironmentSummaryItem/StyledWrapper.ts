import styled from '@emotion/styled';

export const EnvironmentSummaryItemWrapper = styled.li`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.3rem 0;
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1.125rem;
  letter-spacing: normal;

  &:last-child {
    border-bottom: none;
  }

  .environment-summary-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    background: var(--text-tertiary);
  }

  .environment-summary-name {
    color: var(--text-primary);
  }

  .environment-summary-spacer {
    flex: 1;
  }

  .environment-summary-vars {
    color: var(--text-tertiary);
    flex-shrink: 0;
  }
`;
