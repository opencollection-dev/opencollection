import styled from '@emotion/styled';

export const SidebarContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &.compact {
    min-width: var(--sidebar-width-compact);
    max-width: var(--sidebar-width-compact);
  }

  /* Sidebar scrollbar styling */
  & ::-webkit-scrollbar {
    width: 6px;
  }

  & ::-webkit-scrollbar-track {
    background: transparent;
  }

  & ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }

  /* Sidebar Logo styling */
  & .logo {
    padding: 0 8px 12px 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    margin-bottom: 6px;
  }

  &.compact .logo {
    padding: 8px;
  }
`;

export const SidebarItems = styled.div`
  padding: 0;
  overflow-y: auto;
  flex-grow: 1;

  ${SidebarContainer}.compact & {
    padding: 0 4px;
  }
`;

export const SidebarItem = styled.div`
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 0;
  position: relative;
  overflow: hidden;
  padding: 6px 12px;
  display: flex;
  align-items: center;
//   font-size: 13px;
  color: #212121;

  ${SidebarContainer}.compact & {
    padding: 4px 8px;
    font-size: 12px;
    margin-bottom: 1px;
  }

  // &:hover, &.hovered {
  //   background-color: rgba(0, 0, 0, 0.04);
  //   color: #212121;
  // }

  &.active {
    background-color: rgba(0, 0, 0, 0.08);
    color: #212121;
    font-weight: 500;
  }

  // &.active:hover {
  //   background-color: rgba(0, 0, 0, 0.1);
  // }

  // &.folder:hover {
  //   background-color: transparent;
  //   color: #212121;
  // }

  & .method-badge {
    font-size: 10px;
    padding: 3px 6px;
    border-radius: 4px;
    font-weight: 600;
    min-width: 42px;
    text-align: center;
    letter-spacing: 0.03em;
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    text-transform: uppercase;
    margin-right: 8px;
    opacity: 0.85;
  }

  ${SidebarContainer}.compact & .method-badge {
    padding: 2px 4px;
    min-width: 36px;
    font-size: 10px;
  }

  /* Fix for click events */
  & * {
    pointer-events: none;
  }
  
  & svg {
    pointer-events: all;
  }

  ${SidebarContainer}.compact & svg {
    width: 14px;
    height: 14px;
  }
`;

