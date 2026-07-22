import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  height: 100%;
  overflow-y: auto;
  background-color: var(--bg-primary);

  .description,
  .asserts-description {
    font-size: 0.8125rem;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0;
    color: var(--text-muted);
  }
`;
