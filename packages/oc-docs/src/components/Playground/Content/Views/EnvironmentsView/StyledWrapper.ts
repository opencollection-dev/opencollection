import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: var(--oc-background-base);

  .env-header {
    padding: 1.25rem 1.25rem 0;
    flex-shrink: 0;
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
    gap: 0.5rem;
    padding: 0.5rem 1.25rem 1rem 1.25rem;
  }

  .env-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
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
    border-color: var(--primary-color);
  }

  .env-tabs-area {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 0 1.25rem 1.25rem;
  }

  .env-tabs-area .tab-content {
    margin-top: 1rem;
  }
`;
