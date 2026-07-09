import styled from '@emotion/styled';

export const EnvPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px 24px;
`;

export const EnvPill = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border: 1px solid var(--oc-border-border2);
  border-radius: var(--oc-border-radius-md);
  background: transparent;
  color: var(--oc-colors-text-subtext1);
  font-size: var(--oc-font-size-sm);
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  transition: border-color 0.12s ease, background 0.12s ease, color 0.12s ease;

  &:hover {
    color: var(--oc-text);
    background: color-mix(in srgb, var(--oc-text) 4%, transparent);
  }

  &.active {
    color: var(--oc-text);
    border-color: var(--oc-text-link);
    background: color-mix(in srgb, var(--oc-text-link) 8%, transparent);
  }
`;
