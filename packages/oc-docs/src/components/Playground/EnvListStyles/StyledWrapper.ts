import styled from '@emotion/styled';

export const EnvPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px 24px;
`;

export const EnvTabsArea = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 0 24px 24px;

  .tab-content {
    margin-top: 16px;
  }
`;

export const EnvCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const EnvCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--oc-border-border1);
  border-radius: var(--oc-border-radius-md);

  &.disabled {
    opacity: 0.5;
  }

  .enabled {
    margin-top: 2px;
    cursor: pointer;
    accent-color: var(--oc-colors-accent);
    flex-shrink: 0;
  }

  .body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .name {
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    font-family: var(--font-mono);
    font-size: var(--oc-font-size-sm);
    font-weight: 500;
    color: var(--oc-primary-text);
  }

  .value {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .value-input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    font-family: var(--font-mono);
    font-size: var(--oc-font-size-sm);
    color: var(--oc-text);
  }

  .datatype {
    flex-shrink: 0;
    font-size: var(--oc-font-size-sm);
    color: var(--oc-colors-text-subtext1);
  }

  .delete {
    margin-top: 2px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--oc-colors-text-subtext1);
    transition: color 0.12s ease;
  }

  .delete:hover {
    color: var(--oc-colors-text-danger);
  }
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
