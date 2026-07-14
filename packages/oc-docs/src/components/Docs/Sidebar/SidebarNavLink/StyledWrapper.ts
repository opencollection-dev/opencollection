import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  box-sizing: border-box;
  user-select: none;
  border-radius: var(--oc-radius);
  color: var(--oc-sidebar-color);
  transition: background-color 0.12s ease, color 0.12s ease;

  &.muted {
    color: var(--text-secondary);
  }

  &:hover {
    background-color: color-mix(in srgb, var(--oc-text) 4%, transparent);
    color: var(--text-primary);
  }

  &.active {
    background-color: color-mix(in srgb, var(--oc-colors-accent) 8%, transparent);
    color: var(--oc-colors-accent);
    font-weight: 500;
  }

  &.active:hover {
    background-color: color-mix(in srgb, var(--oc-colors-accent) 12%, transparent);
    color: var(--oc-colors-accent);
  }

  &.active .navlink-icon,
  &.active .navlink-chevron {
    color: var(--oc-colors-text-subtext1);
  }

  .navlink-main {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 0.4375rem;
    padding: 0.3125rem 0.5rem 0.3125rem 0;
    background: transparent;
    border: 0;
    cursor: pointer;
    text-align: left;
    font-size: var(--font-size-base);
    line-height: 1.25;
    font-weight: inherit;
    color: inherit;
  }

  .navlink-main:focus-visible {
    outline: 0.125rem solid var(--oc-colors-accent);
    outline-offset: -0.125rem;
    border-radius: 0.375rem;
  }

  .navlink-leading {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    flex-shrink: 0;
  }

  .navlink-icon {
    color: var(--oc-colors-text-subtext1);
  }

  .navlink-icon svg {
    width: 0.75rem;
    height: 0.75rem;
  }

  .navlink-method {
    width: 2.125rem;
    flex-shrink: 0;
    margin-right: -0.25rem;
    font-family: var(--font-mono);
    font-size: 0.65625rem;
    line-height: 1.2;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    text-align: left;
  }

  .navlink-spacer {
    flex-shrink: 0;
    width: 0.75rem;
  }

  .navlink-chevron {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 0.75rem;
    height: 1.125rem;
    padding: 0;
    background: transparent;
    border: 0;
    border-radius: var(--oc-radius);
    color: var(--oc-colors-text-subtext1);
    cursor: pointer;
  }

  .navlink-chevron:focus-visible {
    outline: 0.125rem solid var(--oc-colors-accent);
    outline-offset: -0.125rem;
  }

  .navlink-chevron svg {
    width: 0.75rem;
    height: 0.75rem;
    transition: transform 0.2s ease;
  }

  .navlink-chevron.expanded svg {
    transform: rotate(90deg);
  }

  .navlink-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
