import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: var(--oc-background-base);

  .env-header {
    padding: 16px 24px 0;
    flex-shrink: 0;
  }

  .env-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--oc-text);
  }

  .env-message {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--oc-colors-text-muted);
    background-color: var(--oc-background-base);
  }

  .env-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 16px 24px;
  }

  .env-pill {
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
  }

  .env-pill:hover {
    color: var(--oc-text);
    background: color-mix(in srgb, var(--oc-text) 4%, transparent);
  }

  .env-pill.active {
    color: var(--oc-text);
    border-color: var(--oc-text-link);
    background: color-mix(in srgb, var(--oc-text-link) 8%, transparent);
  }

  .env-tabs-area {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 0 24px 24px;
  }

  .env-tabs-area .tab-content {
    margin-top: 16px;
  }
`;
