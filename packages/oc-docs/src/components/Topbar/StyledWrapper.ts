import styled from '@emotion/styled';

export const StyledWrapper = styled.header`
  --topbar-height: 3.1875rem;

  position: sticky;
  top: 0;
  z-index: var(--z-header);
  width: 100%;
  box-sizing: border-box;
  font-family: var(--font-sans);
  background: var(--oc-background-base);
  border-bottom: 0.0625rem solid var(--oc-border-border0);

  .topbar-bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    height: var(--topbar-height);
    padding: 0 1.25rem;
    box-sizing: border-box;
  }

  &[data-mode='mobile'] .topbar-bar {
    gap: 0.5rem;
    padding: 0 0.75rem;
  }

  &[data-mode='mobile'] .topbar-secondary {
    gap: 0.5rem;
  }

  .topbar-menu {
    margin-left: -0.25rem;
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
    max-width: 27.5rem;
  }

  .topbar-secondary {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  .topbar-spacer {
    flex: 1 1 auto;
  }

  /* Below desktop the SearchBar renders its own centered overlay when collapsed,
     so this row is a zero-height mount point and click-outside boundary rather
     than a visible strip; the inner stretches full-width (no cap) so that
     overlay centers within the docs area, not on a left-aligned field. */
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
