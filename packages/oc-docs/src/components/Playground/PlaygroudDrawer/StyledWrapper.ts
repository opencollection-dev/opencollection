import styled from '@emotion/styled';

export const StyledBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9998;
  will-change: opacity, backdrop-filter;
  transition: none !important;
`;

export const StyledDrawer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-top: 1px solid var(--border-color);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  will-change: transform, height, box-shadow;
  transition: none !important;
  transform: translateY(0);
  transform-origin: bottom;
`;

export const StyledDragBar = styled.div`
  height: 40px;
  cursor: row-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-bottom: 1px solid var(--border-color);
  user-select: none;
  position: relative;
  touch-action: none;
  flex-shrink: 0;

  &:hover {
    background-color: var(--bg-primary);
  }
`;

