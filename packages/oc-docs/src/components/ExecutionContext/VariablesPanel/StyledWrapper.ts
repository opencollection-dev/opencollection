import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  .vars-field-label {
    text-transform: uppercase;
  }

  &.vars-stacked {
    grid-template-columns: 1fr;

    .vars-field-label {
      font-family: var(--font-sans);
      font-weight: 500;
      font-size: 0.625rem;
      line-height: 1;
      letter-spacing: 0.0525rem;
      color: var(--text-tertiary);
      margin: 0 0 0.375rem 0;
      text-transform: none;
    }
  }

  .vars-table .property-empty-message {
    display: flex;
    align-items: center;
    min-height: 2rem;
    padding: 0.5rem 0.875rem;
    border-radius: var(--oc-radius);
    background: var(--oc-background-base);
    box-shadow: inset 0 0 0 1px var(--border-color);
    color: var(--text-tertiary);
  }

  @container docs (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
