import styled from '@emotion/styled';

export const StyledWrapper = styled.section`
  /* "& + &" = a Section directly preceded by another Section. So every section after
     the first gets a top margin — the 2rem gap sits between sections, never above the
     first one. (Adjacent-sibling combinator, with & referencing this component.) */
  & + & {
    margin-top: 2rem;
  }
`;
