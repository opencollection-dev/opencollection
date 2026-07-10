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
    gap: 8px;
    flex-shrink: 0;
    padding: 12px;
  }

  .controls > :first-child {
    flex: 1;
    min-width: 0;
  }

  .controls .env-switcher-trigger {
    width: 100%;
    height: 28px;
    justify-content: space-between;
    padding: 5px 8px;
    border-radius: 6px;
  }

  .controls .env-switcher-trigger-name {
    max-width: none;
  }

  .env-settings {
    flex: none;
    width: 28px;
    height: 28px;
    border: 1px solid var(--oc-border-border2);
    border-radius: 6px;
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
    padding: 4px 6px 12px;
  }


`;
