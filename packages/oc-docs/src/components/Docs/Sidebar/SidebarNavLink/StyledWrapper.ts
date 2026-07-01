import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  border-radius: 6px;
  padding: 5px 8px;
  font-size: 12px;
  line-height: 1.25;
  font-weight: 400;
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

  &:focus-visible {
    outline: 2px solid var(--oc-colors-accent);
    outline-offset: -2px;
  }

  &.active .navlink-icon,
  &.active .navlink-chevron {
    color: var(--oc-colors-accent);
  }

  .navlink-leading {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    flex-shrink: 0;
  }

  .navlink-icon {
    color: var(--oc-border-border2);
  }

  .navlink-icon svg {
    width: 12px;
    height: 12px;
  }

  .navlink-method {
    width: 34px;
    flex-shrink: 0;
    font-family: var(--font-mono);
    font-size: 10.5px;
    line-height: 1.2;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    text-align: left;
  }

  .navlink-chevron {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
    color: var(--oc-border-border2);
    cursor: pointer;
  }

  .navlink-chevron svg {
    width: 12px;
    height: 12px;
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

  .navlink-label.mono {
    font-family: var(--font-mono);
  }
`;
