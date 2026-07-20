import styled from '@emotion/styled';

export const StyledWrapper = styled.nav`
  display: flex;
  align-items: stretch;
  gap: 1rem;
  margin-top: 1.25rem;

  .prevnext-half {
    display: flex;
    flex: 1;
    min-width: 0;
  }
  .prevnext-half--next {
    justify-content: flex-end;
  }

  .prevnext-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    max-width: 20rem;
    min-height: 4.0625rem;
    padding: 0.875rem 1.125rem;
    border-radius: 0.375rem;
    border: 0.0625rem solid var(--oc-border-border0, var(--border-color));
    text-decoration: none;
    transition: border-color 0.12s ease, background-color 0.12s ease;
  }
  @media (hover: hover) {
    .prevnext-card:hover {
      background-color: var(--oc-background-mantle);
    }
  }
  .prevnext-card:active {
    background-color: color-mix(in srgb, var(--oc-text) 6%, transparent);
  }

  .prevnext-chevron {
    display: flex;
    flex-shrink: 0;
    color: var(--primary-color);
  }
  .prevnext-chevron svg {
    width: 0.75rem;
    height: 0.75rem;
  }

  .prevnext-textcol {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    min-width: 0;
  }
  .prevnext-card--next .prevnext-textcol {
    align-items: flex-end;
    text-align: right;
  }

  .prevnext-label {
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1;
    letter-spacing: normal;
    color: var(--oc-colors-text-subtext2);
  }
  .prevnext-name {
    display: flex;
    align-items: baseline;
    gap: 0.375rem;
    max-width: 100%;
    min-width: 0;
    font-size: 0.8125rem;
    line-height: 1;
    font-weight: 600;
    color: var(--oc-text);
  }
  .prevnext-card--next .prevnext-name {
    justify-content: flex-end;
  }
  .prevnext-name-text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .prevnext-method {
    flex-shrink: 0;
    font-size: 0.8125rem;
    font-weight: 700;
    line-height: 1;
    font-family: 'Fira Code', var(--font-mono);
  }

  @container docs (max-width: 1024px) {
    .prevnext-card {
      min-height: 3.5rem;
      padding: 0.625rem 0.875rem;
    }
  }

  @container docs (max-width: 768px) {
    gap: 0.5rem;
    padding-top: 1.25rem;

    .prevnext-card {
      min-height: 3rem;
      padding: 0.5rem 0.625rem;
      gap: 0.375rem;
    }
    .prevnext-label,
    .prevnext-name {
      font-size: 0.75rem;
    }
    .prevnext-method {
      font-size: 0.6875rem;
    }
    .prevnext-name,
    .prevnext-method {
      font-weight: 600;
    }
    .prevnext-label {
      font-weight: 400;
    }
  }
`;
