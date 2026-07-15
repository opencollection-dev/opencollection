import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1rem;

  .collection-settings-header {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .collection-settings-title {
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0;
  }

  .collection-settings-version {
    color: var(--text-tertiary);
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0;
  }

  .collection-settings-tabs {
    flex: 1;
    overflow: hidden;
    margin-top: 1.25rem;

    .tabs {
      gap: 1rem;
    }

    .tab.is-active {
      font-weight: 500;
    }

    .description {
      font-size: 0.8125rem;
      font-weight: 400;
      line-height: 1;
      letter-spacing: 0;
      color: var(--text-muted);
    }

    .variables-tab-header {
      margin-bottom: 0.75rem;
    }
  }
`;
