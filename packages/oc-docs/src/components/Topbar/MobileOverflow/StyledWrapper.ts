import styled from '@emotion/styled';

/** Overflow trigger wrapper + the popover that hosts the relocated slot node. */
export const StyledWrapper = styled.div`
  position: relative;
  flex: none;

  .oc-topbar__overflow-popover {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 40;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 220px;
    padding: 12px;
    box-sizing: border-box;
    background: var(--oc-background-base);
    border: 1px solid var(--oc-border-border1);
    border-radius: var(--oc-border-radius-base);
    box-shadow: var(--oc-shadow-md);
  }
`;
