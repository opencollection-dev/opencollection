import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  .assert-item {
    padding: 0.5rem 1rem;
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
    font-size: 0.78125rem;
    color: var(--text-primary);
  }
`;
