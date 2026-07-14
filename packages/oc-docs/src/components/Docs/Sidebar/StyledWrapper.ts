import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background-color: var(--oc-background-base);
  color: var(--oc-sidebar-color);

  /* Clean thin scrollbar: transparent track (no background column) and no border
     (no divider line beside it). The thumb is hidden by default and shown while
     the list is active (.scrolling class, cleared 1s after activity stops). */
  .sidebar-items::-webkit-scrollbar {
    width: 6px;
  }
  .sidebar-items::-webkit-scrollbar-track {
    background: transparent;
    border: none;
  }
  .sidebar-items::-webkit-scrollbar-thumb {
    background-color: transparent;
    border: none;
    border-radius: 20px;
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
    padding: 10px 6px 0 6px;
  }

  .sidebar-divider {
    flex-shrink: 0;
    height: 1px;
    margin: 8px 0;
    background-color: var(--oc-border-border0);
  }

  /* Real mobile/tablet OS only (class set from useIsMobileDevice, not a width
     breakpoint): drop the nav text 13px -> 12px. */
  &.mobile .navlink-main {
    font-size: 12px;
  }

  .sidebar-items {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    /* No right padding: the selected-row highlight ends at the row's own
       margin-right (4px nested / 8px root) from the right edge, not that plus a
       container gap. Left keeps 6px. */
    padding: 0 0 0 6px;
  }
`;
