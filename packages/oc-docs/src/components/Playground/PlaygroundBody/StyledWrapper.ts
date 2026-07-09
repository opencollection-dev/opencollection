import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  height: 100%;
  min-height: 0;

  .sidebar {
    width: var(--sidebar-width);
    flex-shrink: 0;
    height: 100%;
    min-height: 0;
    border-right: 1px solid var(--oc-border-border0);
    overflow: hidden;
  }

  .view {
    flex: 1;
    min-width: 0;
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: var(--oc-background-base);
  }

  .prompt {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    color: var(--text-secondary);
    font-size: 13px;
  }

  &[data-overlay-sidebar='true'] {
    position: relative;
  }

  &[data-overlay-sidebar='true'] .sidebar {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 5;
    background-color: var(--oc-background-base);
    box-shadow: 2px 0 8px color-mix(in srgb, black 12%, transparent);
  }

  &[data-overlay-sidebar='true'] .view {
    width: 100%;
  }
`;
