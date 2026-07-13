import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  position: relative;
  flex: 0 0 auto;
  align-self: stretch;
  touch-action: none;
  background: var(--border-color);
  transition: background-color 0.15s;

  &:hover {
    background: var(--oc-border-border2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 0.125rem;
    background: var(--oc-border-border2);
    transition: background-color 0.15s;
  }
  &:hover::before {
    background: var(--text-muted);
  }

  &[data-orientation='horizontal'] {
    width: 5px;
    margin: 0 10px;
    cursor: col-resize;
  }
  &[data-orientation='horizontal']::before {
    width: 0.25rem;
    height: 2rem;
  }

  &[data-orientation='vertical'] {
    height: 5px;
    margin: 10px 0;
    cursor: row-resize;
  }
  &[data-orientation='vertical']::before {
    width: 2rem;
    height: 0.25rem;
  }
`;
