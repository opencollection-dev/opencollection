import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  border-left: 1px solid var(--oc-border-border0);
  background-color: var(--oc-background-base);

  &.dragging {
    user-select: none;
  }

  .resize-handle {
    position: absolute;
    top: 0;
    left: -9px;
    width: 18px;
    height: 100%;
    cursor: col-resize;
    touch-action: none;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .resize-handle::after {
    content: '';
    width: 4px;
    height: 40px;
    border-radius: 999px;
    background-color: var(--oc-border-border1);
    transition: background-color 0.15s ease;
  }

  .dock-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  .dock-content {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }
`;
