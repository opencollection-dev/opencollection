import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1.25rem 0;

  .collection-settings-header {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
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
    min-height: 0;
    overflow-y: auto;

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
