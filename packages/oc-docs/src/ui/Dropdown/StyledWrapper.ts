import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  position: relative;
  display: inline-flex;

  .dropdown-button {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 23px;
    padding: 0 8px;
    box-sizing: border-box;
    font-family: 'Fira Code', var(--font-mono);
    font-size: 11.5px;
    font-weight: 500;
    cursor: pointer;
    color: var(--oc-colors-text-subtext1);
    background: transparent;
    border: 1px solid var(--oc-border-border2);
    border-radius: var(--oc-radius);
    transition: border-color 0.12s ease, color 0.12s ease;
  }
  .dropdown-button:hover {
    color: var(--oc-text);
  }
  .dropdown-button[aria-expanded='true'],
  .dropdown-button.is-active {
    color: var(--oc-accents-primary);
    border-color: var(--oc-accents-primary);
  }
  .dropdown-button:focus-visible {
    outline: 2px solid var(--oc-accents-primary);
    outline-offset: 1px;
  }

  .dropdown-chevron {
    display: inline-flex;
    transition: transform 0.12s ease;
  }
  .dropdown-button[aria-expanded='true'] .dropdown-chevron {
    transform: rotate(180deg);
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    z-index: 12;
    width: 190px;
    max-height: 250px;
    overflow-y: auto;
    margin: 0;
    padding: 8px;
    list-style: none;
    background: var(--oc-background-base);
    border: 1px solid var(--oc-border-border0);
    border-radius: var(--oc-radius);
  }
  .dropdown-menu.align-right {
    left: auto;
    right: 0;
  }

  .dropdown-option {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    height: 27px;
    padding: 7px 8px;
    box-sizing: border-box;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 400;
    line-height: 1;
    text-align: left;
    color: var(--oc-text);
    background: transparent;
    border: 0;
    border-radius: var(--oc-radius);
  }
  .dropdown-option:hover,
  .dropdown-option:focus-visible {
    outline: none;
    background: var(--oc-background-mantle);
  }
  .dropdown-option.is-selected {
    font-weight: 600;
    color: var(--oc-accents-primary);
    background: color-mix(in srgb, var(--oc-accents-primary) 8%, transparent);
  }
  .dropdown-option svg {
    flex-shrink: 0;
    width: 12px;
    height: 12px;
    color: var(--oc-colors-text-subtext1);
  }
  .dropdown-option.is-selected svg {
    color: var(--oc-accents-primary);
  }

  .dropdown-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dropdown-group-label {
    padding: 6px 8px 2px;
    font-family: var(--font-sans);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--oc-colors-text-subtext1);
  }

  .dropdown-check {
    margin-left: auto;
    color: var(--oc-accents-primary);
  }

  @media (max-width: 767px) {
    .dropdown-menu {
      left: auto;
      right: 0;
    }
  }
`;
