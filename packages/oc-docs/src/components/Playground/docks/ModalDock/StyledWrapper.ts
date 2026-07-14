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
    background-color: color-mix(in srgb, var(--oc-text) 45%, transparent);
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
    box-shadow: 0 24px 60px color-mix(in srgb, var(--oc-text) 22%, transparent);
  }

  .modal-content {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }
`;
