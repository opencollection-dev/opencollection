import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  .script-row--marker {
    border-top: 1px solid var(--oc-border-border0);
  }

  .script-line {
    display: grid;
    grid-template-columns: 1.25rem 0.875rem minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
  }
  .step-num {
    justify-self: end;
    font-family: var(--font-mono);
    font-size: 0.71875rem;
    color: var(--text-muted);
  }

  .script-http-main {
    display: inline-flex;
    align-items: baseline;
    gap: 0.75rem;
    min-width: 0;
  }
  .script-http-label {
    flex: none;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--primary-text);
  }
  .script-http-url {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 600px) {
    .script-line {
      gap: 0.5rem;
      padding: 0.625rem 0.75rem;
    }
    .script-http-url {
      white-space: normal;
      overflow-wrap: anywhere;
    }
    .script-http-main {
      flex-wrap: wrap;
      column-gap: 0.5rem;
    }
  }
`;
