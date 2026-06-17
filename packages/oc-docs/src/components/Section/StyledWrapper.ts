import styled from '@emotion/styled';

/**
 * Wrapper for a labelled page section. Owns the spacing between consecutive
 * sections (`& + &`) so callers can stack them without managing margins.
 */
export const SectionWrapper = styled.section`
  & + & {
    margin-top: 2rem;
  }
`;
