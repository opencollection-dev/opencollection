import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  max-width: 1280px;
  margin-inline: auto;
  padding: 0.9375rem 3rem;

  @container docs (max-width: 768px) {
    padding: 0.9375rem 1.25rem;
  }
`;
