import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  .assert-item {
    padding: 11px 16px;
  }
  .assert-item:not(:first-child) {
    border-top: 1px solid var(--oc-border-border0);
  }
  .assert-item.is-disabled {
    opacity: 0.55;
  }
  .assert-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .assert-expr {
    flex: 1;
    min-width: 0;
    font-family: var(--font-mono);
    font-size: 12.5px;
    color: var(--text-primary);
  }
`;
