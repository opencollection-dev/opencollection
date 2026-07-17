import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
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
    gap: 7px;
    padding: 5px 8px 5px 0;
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
    outline: 2px solid var(--oc-colors-accent);
    outline-offset: -2px;
    border-radius: 6px;
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
    width: 12px;
    height: 12px;
  }

  .navlink-method {
    width: 2.5rem;
    flex-shrink: 0;
    /* inline-block so the badge's own text baseline (not a flex box's synthesised
       one) sits on the name's baseline via align-self below, reading as level with
       the request name. Paired with align-self on .navlink-label. */
    display: inline-block;
    align-self: baseline;
    font-family: var(--font-mono);
    font-size: 10.5px;
    line-height: 1;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    text-align: left;
  }

  .navlink-spacer {
    flex-shrink: 0;
    width: 12px;
  }

  .navlink-chevron {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 18px;
    padding: 0;
    background: transparent;
    border: 0;
    border-radius: var(--oc-radius);
    color: var(--oc-colors-text-subtext1);
    cursor: pointer;
  }

  .navlink-chevron:focus-visible {
    outline: 2px solid var(--oc-colors-accent);
    outline-offset: -2px;
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
    /* Share a baseline with the method badge (both opt in, so icon/folder rows
       stay vertically centred). */
    align-self: baseline;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
