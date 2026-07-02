import styled from '@emotion/styled';

export const StyledWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  width: 100%;
  box-sizing: border-box;
  font-family: var(--font-sans);
  background: var(--oc-background-base);
  border-bottom: 1px solid var(--oc-border-border1);

  .topbar-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 51px;
    padding: 0 20px;
    box-sizing: border-box;
  }

  &[data-mode='mobile'] .topbar-bar {
    gap: 8px;
    padding: 0 12px;
  }

  .topbar-menu {
    margin-left: -4px;
  }

  .topbar-search {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
    justify-content: center;
  }

  .topbar-search-inner {
    width: 100%;
    max-width: 440px;
  }

  .topbar-secondary {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .topbar-spacer {
    flex: 1 1 auto;
  }

  .topbar-search-row {
    display: flex;
    align-items: center;
    height: 0;
    padding: 0;
    box-sizing: border-box;

    .topbar-search-inner {
      max-width: none;
    }
  }
`;
