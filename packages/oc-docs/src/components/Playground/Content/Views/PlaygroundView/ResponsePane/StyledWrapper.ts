import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  height: 100%;
  min-height: 0;
  background-color: var(--bg-primary);

  .tab-panel {
    min-height: 0;
    overflow-y: auto;
  }

  & .send-icon {
    padding: 0.5625rem;
    border-radius: 50%;
    background: var(--oc-background-mantle);
  }
`;

export const SendIconWrapper = styled.div`
  padding: 0.5625rem;
  border-radius: 50%;
  background: var(--oc-background-mantle);

  svg {
    color: var(--text-muted);
  }
`
