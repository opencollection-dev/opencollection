import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .tabs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  }

  .tabs {
    display: flex;
    flex-shrink: 0;
    
    .tab {
      border: none;
      border-bottom: solid 2px transparent;
      margin-right: 1.25rem;
      color: var(--oc-tabs-color);
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
      position: relative;
      background: none;
      padding-bottom: 6px;

      &:focus,
      &:active,
      &:focus-within,
      &:focus-visible,
      &:target {
        outline: none !important;
        box-shadow: none !important;
      }

      &:hover:not(.active) {
        color: var(--text-primary);
      }

      &.active {
        color: var(--oc-tabs-active-color);
        border-bottom-color: var(--primary-color);
        font-weight: 600;
      }

      .content-indicator {
        margin-left: 2px;
        font-size: 0.7em;
        color: var(--text-tertiary);
        font-weight: normal;
      }
    }
  }

  &.tabs-variant-button .tabs {
    gap: 0.5rem;

    .tab {
      padding: 0.5rem 1rem;
      margin-right: 0;
      border: none;
      border-bottom: none;
      border-radius: 0.5rem;
      background: transparent;
      color: var(--oc-tabs-color);

      &:hover:not(.active):not(.disabled) {
        background: var(--oc-background-surface1);
        color: var(--text-primary);
      }

      &.active {
        background: var(--oc-background-surface2);
        color: var(--text-primary);
        border-bottom-color: transparent;
      }
    }
  }

  .tabs-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .tab-content {
    flex: 1;
    overflow: auto;
    min-height: 0;
  }
`;