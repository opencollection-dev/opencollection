import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  border-top: 1px solid var(--oc-border-border0);
  background-color: var(--oc-background-base);

  &.dragging {
    user-select: none;
  }

  .resize-handle {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 18px;
    cursor: row-resize;
    touch-action: none;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .resize-handle::after {
    content: '';
    width: 40px;
    height: 4px;
    border-radius: 999px;
    background-color: var(--oc-border-border0);
    transition: background-color 0.15s ease;
  }

  .resize-handle:hover::after,
  &.dragging .resize-handle::after {
    background-color: var(--oc-border-border1);
  }

  .dock-content {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }
`;
