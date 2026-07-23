import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  max-width: 100rem;
  margin-inline: auto;
  padding: 1rem 3rem;

  @container docs (max-width: 768px) {
    padding: 0.9375rem 1.25rem;
  }
`;
