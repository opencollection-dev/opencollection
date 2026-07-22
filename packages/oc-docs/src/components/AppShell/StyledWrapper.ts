import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;

  &[data-dock='inline'] {
    flex-direction: row;
  }

  .appshell-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    container-type: inline-size;
    container-name: docs;
  }

  .appshell-main {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  .appshell-row {
    display: flex;
    flex: 1;
    min-height: 0;
    position: relative;
  }

  .appshell-sidebar {
    width: var(--sidebar-width);
    flex-shrink: 0;
    height: 100%;
    overflow: hidden;
    border-right: 1px solid var(--oc-border-border0);
    background-color: var(--oc-background-base);
  }

  .appshell-sidebar-resizer {
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

  .appshell-content {
    flex: 1;
    min-width: 0;
    height: 100%;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    scrollbar-width: thin;
    scrollbar-color: var(--oc-scrollbar-color) transparent;
  }

  .appshell-content::-webkit-scrollbar {
    width: 6px;
  }

  .appshell-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .appshell-content::-webkit-scrollbar-thumb {
    background-color: var(--oc-scrollbar-color);
    border-radius: 20px;
  }

  .appshell-content::-webkit-scrollbar-thumb:hover {
    background-color: color-mix(in srgb, var(--oc-text) 20%, transparent);
  }

  .appshell-collapse,
  .appshell-reopen {
    position: absolute;
    z-index: calc(var(--z-sidebar, 5) + 1);
    width: 22px;
    height: 22px;
    border: 1px solid var(--oc-border-border0);
    border-radius: var(--oc-radius);
    background-color: var(--oc-background-base);
    color: var(--oc-colors-text-subtext0);
  }

  .appshell-collapse svg,
  .appshell-reopen svg {
    width: 14px;
    height: 14px;
  }

  .appshell-collapse:hover,
  .appshell-reopen:hover {
    background-color: var(--oc-background-surface0);
    color: var(--text-secondary);
  }

  .appshell-collapse {
    top: 14px;
    left: calc(var(--sidebar-width) - 12px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
  }

  .appshell-sidebar:hover ~ .appshell-collapse,
  .appshell-collapse:hover {
    opacity: 1;
    pointer-events: auto;
  }

  .appshell-reopen {
    top: 14px;
    left: 12px;
  }
`;
