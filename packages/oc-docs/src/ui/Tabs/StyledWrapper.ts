import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;

  .tabs-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem 1rem;
  }

  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    min-width: 0;
  }

  .tab {
    position: relative;
    border: none;
    border-bottom: 0.125rem solid transparent;
    padding: 0.25rem 0;
    background: none;
    color: var(--oc-colors-text-subtext1);
    font-family: var(--font-sans);
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.125rem;
    letter-spacing: 0;
    cursor: pointer;
    transition: color 0.15s ease;
  }
  .tab::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -0.125rem;
    height: 0.125rem;
    background: var(--primary-color);
    transform: scaleX(0);
  }
  .tab:hover:not(.is-active):not(:disabled) {
    color: var(--text-primary);
  }
  .tab.is-active {
    color: var(--oc-tabs-active-color);
    font-weight: 600;
  }
  .tab.is-active::after {
    transform: scaleX(1);
  }
  .tab:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .tab:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    border-radius: 2px;
  }
  .tab-count {
    margin-left: 0.1875rem;
    font-size: 0.625rem;
    line-height: 1;
    letter-spacing: 0;
    color: var(--text-secondary);
  }

  &.tabs-variant-button .tabs {
    gap: 0.5rem;

    .tab {
      padding: 0.6rem 0.75rem;
      border: none;
      border-bottom: none;
      border-radius: var(--oc-radius);
      background: transparent;
      color: var(--text-muted);
      font-size: 0.8125rem;
      font-weight: 400;
      line-height: 1;

      &::after {
        display: none;
      }

      &:hover:not(.is-active):not(.disabled) {
        color: var(--text-primary);
      }

      &.is-active {
        background: var(--oc-background-surface0);
        color: var(--text-primary);
        font-weight: 600;
      }
    }
  }

  &.tabs-variant-button .tab-panel {
    margin-top: 0.75rem;
  }

  .tabs-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
  }

  .tab-panel {
    margin-top: 1rem;
    min-width: 0;
    flex: 1;
  }
  .tab-panel:focus {
    outline: none;
  }

  @media (max-width: 640px) {
    .tabs-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;
