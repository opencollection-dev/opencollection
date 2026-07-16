import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  min-height: 54px;
  border-color: var(--border-color);
  background-color: var(--bg-primary);

  .request-title {
    color: var(--text-primary);
    letter-spacing: -0.015em;
    line-height: 1.3;
  }

  .env-select {
    min-width: 8.125rem;
    padding: 0.375rem 1.625rem 0.375rem 0.625rem;
    text-align: left;
    font-family: inherit;
    color: var(--text-primary);
    background-color: var(--bg-secondary);
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23777' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    outline: none;
    appearance: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      border-color: color-mix(in srgb, var(--oc-text) 15%, transparent);
    }

    &:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--oc-brand) 12%, transparent);
    }
  }
`;
