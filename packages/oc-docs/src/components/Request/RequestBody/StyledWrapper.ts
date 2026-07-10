import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  > *:not(:first-child) {
    margin-top: 0.5rem;
  }
  .request-body-part {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    min-width: 0;
    max-width: 100%;
  }
  .request-body-part .var-text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .request-body-file-tag {
    flex: none;
    padding: 0.0625rem 0.375rem;
    border-radius: var(--oc-radius);
    background: var(--table-header-bg);
    font-family: var(--font-sans);
    font-size: 0.625rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--text-secondary);
  }
  .request-body-content-type {
    flex: none;
    padding: 0.0625rem 0.375rem;
    border-radius: var(--oc-radius);
    background: var(--table-header-bg);
    font-family: var(--font-sans);
    font-size: 0.625rem;
    color: var(--text-secondary);
    white-space: nowrap;
  }
`;
