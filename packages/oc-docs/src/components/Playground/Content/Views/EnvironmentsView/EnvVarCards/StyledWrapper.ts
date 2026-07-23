import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .env-card {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid var(--oc-border-border1);
    border-radius: var(--oc-border-radius-md);
  }

  .env-card.disabled {
    opacity: 0.5;
  }

  .env-card .enabled {
    margin-top: 2px;
  }

  .env-card .body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .env-card .name-row {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .env-card .name {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    font-family: var(--font-mono);
    font-size: var(--oc-font-size-sm);
    font-weight: 500;
    color: var(--oc-primary-text);
  }

  .env-card .value {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .env-card .value .value-secret {
    flex: 1;
  }

  .env-card .value .value-secret .secret-value-input {
    font-size: var(--oc-font-size-sm);
  }

  .env-card .value-input {
    flex: 0 1 auto;
    field-sizing: content;
    max-width: 100%;
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    font-family: var(--font-mono);
    font-size: var(--oc-font-size-sm);
    color: var(--oc-text);
    resize: none;
    overflow: hidden;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    line-height: 1.5;
  }

  .env-card .name::placeholder,
  .env-card .value-input::placeholder {
    color: var(--oc-colors-text-subtext0);
    opacity: 0.6;
  }

  .env-card .value .var-type {
    flex-shrink: 0;
    margin-left: auto;
  }

  .env-card .delete {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--oc-colors-text-subtext1);
    transition: color 0.12s ease;
  }

  .env-card .delete:hover {
    color: var(--oc-colors-text-danger);
  }
`;
