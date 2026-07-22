import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  position: relative;
  flex: 0 0 auto;
  align-self: stretch;
  touch-action: none;
  background: transparent;

  &::after {
    content: '';
    position: absolute;
    background-color: var(--oc-border-border0);
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 999px;
    z-index: 1;
  }

  &[data-orientation='horizontal'] {
    width: 0.75rem;
    cursor: col-resize;
  }
  &[data-orientation='horizontal']::after {
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0.0625rem;
  }
  &[data-orientation='horizontal']::before {
    width: 0.25rem;
    height: 2.5rem;
    background-color: var(--oc-border-border1);
  }

  &[data-orientation='vertical'] {
    height: 0.75rem;
    cursor: row-resize;
  }
  &[data-orientation='vertical']::after {
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 0.0625rem;
  }
  &[data-orientation='vertical']::before {
    width: 2.5rem;
    height: 0.25rem;
    background-color: var(--oc-border-border2);
  }

  &[data-active='true']::after,
  &[data-active='true']::before {
    background-color: var(--oc-border-border2);
  }
`;
