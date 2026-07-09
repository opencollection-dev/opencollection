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
    padding: 0 0 0.25rem;
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
    transform-origin: center;
    transition: transform 0.16s var(--oc-tab-ease);
  }
  .tab:hover:not(.is-active):not(:disabled) {
    color: var(--text-primary);
  }
  .tab.is-active {
    color: var(--oc-tabs-active-color);
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
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0;
    color: var(--text-secondary);
  }

  /* Button variant: filled pill triggers instead of the underline style. */
  &.tabs-variant-button .tabs {
    gap: 0.5rem;
  }
  &.tabs-variant-button .tab {
    padding: 0.5rem 1rem;
    border-bottom: none;
    border-radius: 0.5rem;
    background: transparent;
  }
  &.tabs-variant-button .tab::after {
    display: none;
  }
  &.tabs-variant-button .tab:hover:not(.is-active):not(:disabled) {
    background: var(--oc-background-surface1);
    color: var(--text-primary);
  }
  &.tabs-variant-button .tab.is-active {
    background: var(--oc-background-surface2);
    color: var(--text-primary);
  }

  .tabs-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
  }

  @keyframes oc-tab-panel-in {
    from {
      opacity: 0;
      transform: translateY(0.5rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .tab-panel {
    margin-top: 1rem;
    min-width: 0;
    animation: oc-tab-panel-in 0.2s var(--oc-tab-ease) 0.04s backwards;
  }
  .tab-panel:focus {
    outline: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .tab-panel {
      animation: none;
    }
    .tab::after {
      transition: none;
    }
  }

  @media (max-width: 640px) {
    .tabs-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;
