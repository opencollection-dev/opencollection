import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  .assert-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 2rem;
    padding: 0.345rem 1rem;
  }
  .assert-item:not(:first-child) {
    border-top: 0.0625rem solid var(--oc-border-border0);
  }
  .assert-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .assert-expr {
    flex: 1;
    min-width: 0;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-primary);
  }
`;
