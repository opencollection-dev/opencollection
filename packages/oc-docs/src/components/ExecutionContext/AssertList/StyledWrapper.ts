import styled from '@emotion/styled';

/** Stacked, hairline-divided list of read-only assertion rows (scope pill + expression). */
export const StyledWrapper = styled.div`
  .assert-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 16px;
  }
  .assert-row + .assert-row {
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
