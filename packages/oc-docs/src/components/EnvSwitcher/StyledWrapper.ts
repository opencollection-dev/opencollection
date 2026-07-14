import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  position: relative;
  flex: none;

  .env-switcher-trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.4375rem;
    padding: 0.21875rem 0.5rem;
    box-sizing: border-box;
    background: var(--oc-app-collection-toolbar-environment-selector-bg);
    border: 1px solid var(--oc-border-border1);
    border-radius: var(--oc-radius);
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 500;
    color: var(--oc-app-collection-toolbar-environment-selector-text);
    transition: border-color 0.12s ease;
  }

  .env-switcher-trigger:hover,
  .env-switcher-trigger[aria-expanded='true'] {
    border-color: var(--oc-app-collection-toolbar-environment-selector-hover-border);
    background: var(--oc-app-collection-toolbar-environment-selector-hover-bg);
  }

  .env-switcher-trigger--empty {
    color: var(--oc-app-collection-toolbar-environment-selector-no-environment-text);
    background: var(--oc-app-collection-toolbar-environment-selector-no-environment-bg);
  }

  .env-switcher-chevron {
    display: inline-flex;
    color: var(--oc-app-collection-toolbar-environment-selector-caret);
    flex: none;
  }

  .env-switcher-trigger-name {
    max-width: 160px;
  }

  .env-switcher-popover {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 40;
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: max-content;
    min-width: 100%;
    max-width: min(260px, calc(100vw - 24px));
    padding: 4px;
    box-sizing: border-box;
    background: var(--oc-dropdown-bg);
    border: 1px solid var(--oc-dropdown-separator);
    border-radius: var(--oc-radius);
  }

  .env-switcher-option {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    height: 26px;
    padding: 0 4px;
    box-sizing: border-box;
    background: transparent;
    border: none;
    border-radius: var(--oc-radius);
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: 12px;
    color: var(--oc-dropdown-color);
    text-align: left;
  }

  .env-switcher-option-name {
    max-width: 200px;
  }

  .env-switcher-option:hover {
    background: var(--oc-dropdown-hover-bg);
  }

  .env-switcher-option--active {
    color: var(--oc-dropdown-selected-color);
    background: color-mix(in srgb, var(--oc-dropdown-selected-color) 7%, transparent);
    font-weight: 500;
  }

  .env-switcher-empty {
    padding: 8px 10px;
    font-size: 12px;
    color: var(--oc-dropdown-muted-text);
  }

  @media (max-width: 640px) {
    .env-switcher-trigger-name {
      max-width: 72px;
    }
  }
`;
