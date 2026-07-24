import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background-color: var(--oc-background-base);
  color: var(--oc-sidebar-color);

  .sidebar-items::-webkit-scrollbar {
    width: 0.375rem;
  }
  .sidebar-items::-webkit-scrollbar-track {
    background: transparent;
    border: none;
  }
  .sidebar-items::-webkit-scrollbar-thumb {
    background-color: transparent;
    border: none;
    border-radius: 1.25rem;
    transition: background-color 0.4s ease;
  }
  .sidebar-items.scrolling::-webkit-scrollbar-thumb {
    background-color: var(--oc-scrollbar-color);
  }

  .sidebar-top-links {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 0.625rem 0.75rem 0 0.75rem;
  }

  .sidebar-divider {
    flex-shrink: 0;
    height: 1px;
    margin: 0.5rem 0;
    background-color: var(--oc-border-border0);
  }

  &.mobile .navlink-main {
    font-size: 0.75rem;
  }

  .sidebar-items {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 0 0 0 0.75rem;
  }
`;
