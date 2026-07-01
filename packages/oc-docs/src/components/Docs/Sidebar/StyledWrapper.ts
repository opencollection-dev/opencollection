import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background-color: var(--oc-background-base);
  color: var(--oc-sidebar-color);

  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 20px;
  }
  &:hover ::-webkit-scrollbar-thumb {
    background-color: var(--oc-scrollbar-color);
  }

  .sidebar-top-links {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 10px 6px 0 6px;
  }

  .sidebar-divider {
    flex-shrink: 0;
    height: 1px;
    margin: 8px 0;
    background-color: var(--oc-border-border2);
  }

  .sidebar-items {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 0 6px;
  }
`;
