import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  height: 100%;
  background-color: var(--bg-primary);

  .oc-tabs {
    height: 100%;
  }
  .oc-tabs .tab-panel {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }
`;
