import styled from '@emotion/styled';

export const StyledWrapper = styled.span`
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
  flex-shrink: 0;

  &.scope-tag--request {
    color: var(--oc-status-info-text);
    background: color-mix(in srgb, var(--oc-status-info-text) 12%, transparent);
  }
  &.scope-tag--folder {
    color: #6a4ab5;
    background: #6a4ab51a;
  }
  &.scope-tag--collection {
    color: var(--oc-status-warning-text);
    background: color-mix(in srgb, var(--oc-status-warning-text) 12%, transparent);
  }
`;
