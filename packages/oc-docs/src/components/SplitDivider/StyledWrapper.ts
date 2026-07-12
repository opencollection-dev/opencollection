import styled from '@emotion/styled';

/**
 * A 5px draggable split divider with a darker center grab handle. The whole
 * track is draggable. Orientation switches the axis: `horizontal` layout gives a
 * vertical bar (drag left/right), `vertical` layout gives a horizontal bar.
 */
export const StyledWrapper = styled.div`
  position: relative;
  flex: 0 0 auto;
  align-self: stretch;
  background: var(--border-color);

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 2px;
    background: var(--oc-border-border2);
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
    width: 4px;
    height: 32px;
  }

  &[data-orientation='vertical'] {
    height: 5px;
    margin: 10px 0;
    cursor: row-resize;
  }
  &[data-orientation='vertical']::before {
    width: 32px;
    height: 4px;
  }
`;
