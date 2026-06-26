import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  .assert-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 16px;
  }
  .assert-row:not(:first-child) {
    border-top: 1px solid var(--oc-border-border0);
  }
  .assert-row.is-disabled {
    opacity: 0.55;
  }
  .assert-expr {
    font-family: var(--font-mono);
    font-size: 12.5px;
    color: var(--text-primary);
  }
`;
