import styled from '@emotion/styled';

export const SidebarContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &.compact {
    min-width: var(--sidebar-width-compact);
    max-width: var(--sidebar-width-compact);
  }

  & ::-webkit-scrollbar {
    width: 6px;
  }

  & ::-webkit-scrollbar-track {
    background: transparent;
  }

  & ::-webkit-scrollbar-thumb {
    background-color: var(--oc-scrollbar-color);
    border-radius: 10px;
  }

  & .logo {
    padding: 0 8px 12px 8px;
    border-bottom: 1px solid var(--oc-border-border1);
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
  color: var(--oc-text);

  ${SidebarContainer}.compact & {
    padding: 4px 8px;
    font-size: 12px;
    margin-bottom: 1px;
  }

  // &:hover, &.hovered {
  //   background-color: color-mix(in srgb, var(--oc-text) 4%, transparent);
  //   color: var(--oc-text);
  // }

  &.active {
    background-color: color-mix(in srgb, var(--oc-text) 8%, transparent);
    color: var(--oc-text);
    font-weight: 500;
  }

  // &.active:hover {
  //   background-color: color-mix(in srgb, var(--oc-text) 10%, transparent);
  // }

  // &.folder:hover {
  //   background-color: transparent;
  //   color: var(--oc-text);
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
