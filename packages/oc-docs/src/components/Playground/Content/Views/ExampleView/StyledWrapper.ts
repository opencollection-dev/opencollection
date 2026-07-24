import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 1.25rem 1.25rem 0;
  background: var(--bg-primary);

  .example-view-head {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 0.75rem;
  }
  .example-view-name {
    font-size: var(--oc-font-size-md);
    line-height: 1.4;
    font-weight: 600;
    color: var(--text-primary);
  }
  .example-view-desc {
    color: var(--text-secondary);
    font-size: 0.8125rem;
  }
  .example-view-empty {
    color: var(--text-secondary);
    font-size: 0.8125rem;
    line-height: 1.4;
  }
  .example-view-urlbar {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.375rem 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background-color: var(--oc-background-mantle);
    margin-bottom: 1rem;
  }
  .example-view-url {
    flex: 1 1 auto;
    min-width: 0;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    line-height: 1.125rem;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .example-view-status {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.125rem 0.375rem;
    border-radius: var(--oc-radius);
  }
  .example-view-grid {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    align-items: stretch;
    width: 100%;
  }
  .example-view-grid[data-orientation='vertical'] {
    flex-direction: column;
  }
  .example-view-grid.is-resizing {
    cursor: col-resize;
    user-select: none;
  }
  .example-view-grid[data-orientation='vertical'].is-resizing {
    cursor: row-resize;
  }
  .example-view-pane {
    flex: 0 0 auto;
    min-width: 0;
    min-height: 0;
    overflow: auto;
  }
  .example-view-pane-response {
    flex: 1 1 0;
    width: auto;
    height: auto;
  }
  .example-view-pane-title {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }
  .example-view-section {
    margin-bottom: 1rem;
  }
  .example-view-section-label {
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--text-secondary);
    margin-bottom: 0.375rem;
  }
`;
