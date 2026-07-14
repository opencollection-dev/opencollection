import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 52px;
  padding: 0 14px;
  border-bottom: 1px solid var(--oc-border-border1);
  background-color: var(--oc-background-base);

  .header-left,
  .header-right {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .header-brand {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }

  .header-brand svg {
    width: 18px;
    height: 18px;
  }

  .header-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }

  /* Muted grey for the sidebar-toggle + collapse + close controls (Figma:
     subtext0 #9b9b9b); two-class selectors win over IconButton's default. */
  .header-left .header-sidebar-toggle,
  .header-right .header-collapse,
  .header-right .header-close {
    color: var(--oc-colors-text-subtext0);
  }

  /* Subtle near-white hover; keeps the grey icon (overrides IconButton's
     default hover colour/background). */
  .header-left .header-sidebar-toggle:hover,
  .header-right .header-collapse:hover,
  .header-right .header-close:hover {
    color: var(--oc-colors-text-subtext0);
    background: var(--oc-background-surface-bright);
  }

  .header-collapse svg {
    transition: transform 0.15s ease;
  }

  .header-collapse.collapsed svg {
    transform: rotate(180deg);
  }
`;
