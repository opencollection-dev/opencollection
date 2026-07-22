import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  height: 100%;
  min-height: 0;
  position: relative;

  .sidebar {
    width: var(--sidebar-width);
    flex-shrink: 0;
    height: 100%;
    min-height: 0;
    border-right: 1px solid var(--oc-border-border0);
    overflow: hidden;
  }

  .sidebar-resizer {
    position: absolute;
    top: 0;
    bottom: 0;
    left: var(--sidebar-width);
    width: 9px;
    transform: translateX(-4px);
    z-index: calc(var(--z-sidebar, 5) + 1);
    cursor: col-resize;
    touch-action: none;
  }

  .sidebar-resizer::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 1px;
    transform: translateX(-50%);
    background-color: transparent;
  }

  .sidebar-resizer:hover::before,
  .sidebar-resizer[data-dragging='true']::before {
    width: 2px;
    background-color: var(--oc-border-border2);
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
    box-shadow: 2px 0 8px color-mix(in srgb, var(--oc-text) 12%, transparent);
  }

  &[data-overlay-sidebar='true'] .view {
    width: 100%;
  }
`;
