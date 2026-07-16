import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  display: flex;
  align-items: center;
  justify-content: center;

  .modal-backdrop {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, var(--oc-modal-backdrop-opacity));
    backdrop-filter: blur(2px);
  }

  .modal-window {
    position: relative;
    display: flex;
    flex-direction: column;
    width: calc(100vw - 48px);
    height: calc(100vh - 56px);
    border: 1px solid var(--oc-border-border2);
    border-radius: var(--oc-radius);
    overflow: hidden;
    background-color: var(--oc-background-base);
    box-shadow: var(--shadow-md);
  }

  .modal-content {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }
`;
