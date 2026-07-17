import styled from '@emotion/styled';

/**
 * Styling for the menu dropdown popover. Ported from bruno-app's
 * `components/Dropdown` styled-components wrapper, with the runtime
 * `theme.dropdown.*` values mapped onto oc-docs `--oc-*` CSS variables.
 */
export const StyledWrapper = styled.div`
  min-width: 10rem;
  font-size: 0.8125rem;
  color: var(--oc-dropdown-color);
  background-color: var(--oc-dropdown-bg);
  box-shadow: var(--oc-dropdown-shadow);
  border-radius: var(--oc-border-radius-base);
  border: 1px solid var(--oc-dropdown-border);
  max-height: 90vh;
  overflow-y: auto;
  max-width: unset !important;
  padding: 0.25rem;

  [role='menu'] {
    outline: none;
    &:focus {
      outline: none;
    }
    &:focus-visible {
      outline: none;
    }
  }

  .label-item {
    display: flex;
    align-items: center;
    padding: 0.375rem 0.625rem 0.25rem 0.625rem;
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.025em;
    color: var(--oc-dropdown-color);
    opacity: 0.6;
    margin-top: 0.25rem;
    &:first-of-type {
      margin-top: 0;
    }
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.275rem 0.625rem;
    cursor: pointer;
    border-radius: 0.375rem;
    margin: 1px 0;
    font-size: 0.8125rem;

    &.active {
      color: var(--oc-colors-text-yellow) !important;
      .dropdown-icon {
        color: var(--oc-colors-text-yellow) !important;
      }
    }

    .dropdown-label {
      flex: 1;
    }

    .dropdown-icon {
      flex-shrink: 0;
      width: 1rem;
      height: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--oc-dropdown-icon-color);
      opacity: 0.8;
    }

    .dropdown-right-section {
      margin-left: auto;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dropdown-tab-count {
      margin-left: auto;
      font-size: 0.6875rem;
      font-weight: 500;
      padding: 1px 0.375rem;
      border-radius: 0.625rem;
      background: var(--oc-dropdown-hover-bg);
      min-width: 1.125rem;
      text-align: center;
    }

    &:hover:not(:disabled):not(.disabled) {
      background-color: var(--oc-dropdown-hover-bg);
    }

    &.selected-focused:not(:disabled):not(.disabled) {
      background-color: var(--oc-dropdown-hover-bg);
    }

    &:focus-visible:not(:disabled):not(.disabled) {
      outline: none;
      background-color: var(--oc-dropdown-hover-bg);
    }

    &:focus:not(:focus-visible) {
      outline: none;
    }

    &:disabled,
    &.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    &.delete-item {
      color: var(--oc-colors-text-danger);
      .dropdown-icon {
        color: var(--oc-colors-text-danger);
      }
      &:hover {
        background-color: color-mix(in srgb, var(--oc-colors-text-danger) 4%, transparent) !important;
        color: var(--oc-colors-text-danger) !important;
      }
    }

    &.border-top {
      border-top: solid 1px var(--oc-dropdown-separator);
      margin-top: 0.25rem;
      padding-top: 0.375rem;
    }

    &.dropdown-item-select {
      padding-left: 1.5rem;
    }

    /* Focused state - applied during keyboard navigation */
    &.dropdown-item-focused {
      background-color: var(--oc-dropdown-hover-bg);
      outline: none;
    }

    /* Active/selected state - applied to the currently selected item */
    &.dropdown-item-active {
      color: var(--oc-dropdown-selected-color) !important;
      background-color: color-mix(in srgb, var(--oc-dropdown-selected-color) 7%, transparent) !important;
      .dropdown-icon {
        color: var(--oc-dropdown-selected-color) !important;
      }

      &:hover {
        color: var(--oc-dropdown-selected-color) !important;
        background-color: color-mix(in srgb, var(--oc-dropdown-selected-color) 7%, transparent) !important;
      }
    }

    /* Combined state - when active item is also focused */
    &.dropdown-item-active.dropdown-item-focused {
      background-color: color-mix(in srgb, var(--oc-dropdown-selected-color) 7%, transparent) !important;
    }

    /* Focus visible for accessibility */
    &:focus-visible {
      outline: 2px solid var(--oc-accents-primary);
      outline-offset: -2px;
    }
  }

  .breadcrumb-collapsed-dropdown {
    max-width: 15.625rem;
  }

  .breadcrumb-collapsed-item {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dropdown-separator {
    height: 1px;
    background-color: var(--oc-dropdown-separator);
    margin: 0.25rem 0;
  }

  .dropdown-header-container,
  .dropdown-footer-container {
    padding: 0.25rem 0.625rem;
  }

  .dropdown-footer-container .method-add-custom {
    appearance: none;
    display: block;
    width: 100%;
    margin: 0;
    padding: 0.25rem 0.6rem;
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--primary-color);
    border-radius: 0.375rem;

    &:hover {
      background-color: var(--oc-dropdown-hover-bg);
    }
  }

  .dropdown-divider {
    height: 1px;
    background-color: var(--oc-dropdown-separator);
    margin: 0.25rem 0;
  }

  .submenu-trigger {
    position: relative;
  }

  .submenu-arrow {
    color: var(--oc-dropdown-muted-text);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    margin-left: auto;
  }
`;

/**
 * Default trigger button rendered when no `children` trigger is supplied.
 * Shows the selected item's text plus a chevron, styled with `--oc-*` vars so
 * it stays self-contained (no app-level components).
 */
export const TriggerButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  height: 1.4375rem;
  padding: 0 0.5rem;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  color: var(--oc-dropdown-color);
  background: transparent;
  border: 1px solid var(--oc-border-border2);
  border-radius: 0.375rem;
  transition:
    border-color 0.12s ease,
    color 0.12s ease;

  &:hover {
    color: var(--oc-text);
  }
  &[aria-expanded='true'] {
    color: var(--oc-accents-primary);
    border-color: var(--oc-accents-primary);
  }
  &:focus-visible {
    outline: 2px solid var(--oc-accents-primary);
    outline-offset: 1px;
  }

  .menu-dropdown-trigger-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .menu-dropdown-trigger-chevron {
    flex-shrink: 0;
    transition: transform 0.12s ease;
  }
  &[aria-expanded='true'] .menu-dropdown-trigger-chevron {
    transform: rotate(180deg);
  }
`;

export default StyledWrapper;
