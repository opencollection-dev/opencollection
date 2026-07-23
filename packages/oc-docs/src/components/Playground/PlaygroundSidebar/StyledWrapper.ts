import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background-color: var(--oc-background-base);

  .controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
    padding: 0.75rem;
  }

  .controls > :first-child {
    flex: 1;
    min-width: 0;
  }

  .controls .env-switcher-trigger {
    width: 100%;
    height: 1.75rem;
    justify-content: space-between;
    padding: 0.3125rem 0.5rem;
    border-radius: var(--oc-radius);
  }

  .controls .env-switcher-trigger-name {
    max-width: none;
  }

  .env-settings {
    flex: none;
    width: 1.75rem;
    height: 1.75rem;
    border: 1px solid var(--oc-border-border2);
    border-radius: var(--oc-radius);
    color: var(--text-secondary);
  }

  .env-settings svg {
    width: 15px;
    height: 15px;
  }

  .env-settings.active {
    color: var(--oc-colors-accent);
    border-color: var(--oc-colors-accent);
  }

  .tree {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 0.25rem 0.75rem 0.75rem;
  }

  &.mobile .navlink-main {
    font-size: 0.75rem;
  }

  .tree::-webkit-scrollbar {
    width: 0.375rem;
  }
  .tree::-webkit-scrollbar-track {
    background: transparent;
    border: none;
  }
  .tree::-webkit-scrollbar-thumb {
    background-color: transparent;
    border: none;
    border-radius: 1.25rem;
    transition: background-color 0.4s ease;
  }
  .tree.scrolling::-webkit-scrollbar-thumb {
    background-color: var(--oc-scrollbar-color);
  }
`;
