import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;

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
    border-right: 1px solid var(--oc-border-border2);
    background-color: var(--oc-background-base);
  }

  .appshell-content {
    flex: 1;
    min-width: 0;
    height: 100%;
    overflow-y: auto;
    overscroll-behavior-y: contain;
  }

  .appshell-collapse,
  .appshell-reopen {
    position: absolute;
    z-index: calc(var(--z-sidebar, 5) + 1);
    width: 22px;
    height: 22px;
    border: 1px solid var(--oc-border-border2);
    border-radius: 6px;
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
