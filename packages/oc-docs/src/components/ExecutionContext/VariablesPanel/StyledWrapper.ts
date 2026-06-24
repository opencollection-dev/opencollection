import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  .vars-field-label {
    text-transform: uppercase;
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

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
