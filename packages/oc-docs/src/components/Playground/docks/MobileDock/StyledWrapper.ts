import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  display: flex;
  flex-direction: column;
  background-color: var(--oc-background-base);

  .mobile-content {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }
`;
