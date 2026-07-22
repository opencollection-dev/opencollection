import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  position: relative;
  flex: none;

  .env-switcher-trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.4375rem;
    height: 1.75rem;
    padding: 0 0.5rem;
    box-sizing: border-box;
    background: var(--oc-app-collection-toolbar-environment-selector-bg);
    border: 0.0625rem solid var(--oc-border-border1);
    border-radius: var(--oc-radius);
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: 0.75rem;
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
    max-width: 10rem;
  }

  @media (max-width: 640px) {
    .env-switcher-trigger-name {
      max-width: 4.5rem;
    }
  }
`;
