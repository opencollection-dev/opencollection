import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.5);
  animation: oc-modal-fade 0.12s ease-out;

  @keyframes oc-modal-fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .oc-modal-dialog {
    display: flex;
    flex-direction: column;
    width: min(60rem, 100%);
    max-height: 88vh;
    background: var(--oc-background-base);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    box-shadow: var(--shadow-md);
    overflow: hidden;
    outline: none;
  }

  .oc-modal-head {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
    padding: 0.875rem 1.125rem;
    border-bottom: 1px solid var(--border-color);
  }
  .oc-modal-title {
    flex: 1;
    min-width: 0;
  }
  .oc-modal-title > * {
    margin: 0;
  }

  .oc-modal-close {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--text-tertiary);
    border-radius: var(--oc-radius);
    cursor: pointer;
    transition: color 0.12s ease, background-color 0.12s ease;
  }
  .oc-modal-close:hover {
    color: var(--text-primary);
    background: var(--oc-background-surface0);
  }
  .oc-modal-close:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  .oc-modal-body {
    min-height: 0;
    overflow: auto;
    padding: 1.125rem;
  }
`;
