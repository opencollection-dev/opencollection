import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  .title {
    color: var(--text-primary);
  }

  .description {
    color: var(--text-secondary);
  }

  .vars-section + .vars-section {
    margin-top: 1.25rem;
  }

  .vars-section-title {
    margin: 0 0 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0;
    color: var(--oc-colors-text-subtext2);
  }

  .expr-header {
    display: inline-flex;
    align-items: center;
  }
`;
