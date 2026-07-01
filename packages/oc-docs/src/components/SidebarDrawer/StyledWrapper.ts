import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: var(--z-overlay, 50);
    background-color: color-mix(in srgb, #000 45%, transparent);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.22s ease, visibility 0.22s ease;
  }

  &.open .backdrop {
    opacity: 1;
    visibility: visible;
  }

  .panel {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: var(--sidebar-width);
    max-width: 86vw;
    z-index: calc(var(--z-overlay, 50) + 1);
    background-color: var(--oc-background-base);
    border-right: 1px solid var(--oc-border-border1);
    box-shadow: var(--shadow-md);
    transform: translateX(-100%);
    visibility: hidden;
    pointer-events: none;
    transition: transform 0.22s cubic-bezier(0.2, 0.7, 0.3, 1), visibility 0s 0.22s;
    will-change: transform;
  }

  &.open .panel {
    transform: translateX(0);
    visibility: visible;
    pointer-events: auto;
    transition: transform 0.22s cubic-bezier(0.2, 0.7, 0.3, 1), visibility 0s;
  }
`;
