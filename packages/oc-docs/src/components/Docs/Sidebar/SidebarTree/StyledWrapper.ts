import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: var(--guide-left, 14px);
    width: 1px;
    background-color: var(--oc-background-surface0);
  }
`;
