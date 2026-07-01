import styled from '@emotion/styled';

export const StyledWrapper = styled.nav`
  display: flex;
  align-items: stretch;
  gap: 16px;
  margin-top: 20px;

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
    gap: 10px;
    width: 100%;
    min-height: 65px;
    padding: 14px 18px;
    border-radius: 8px;
    border: 1px solid var(--oc-border-border1, var(--border-color));
    text-decoration: none;
    transition: border-color 0.12s ease, background-color 0.12s ease;
  }
  @media (hover: hover) {
    .prevnext-card:hover {
      background-color: color-mix(in srgb, var(--oc-text) 6%, transparent);
    }
  }
  .prevnext-card:active {
    background-color: color-mix(in srgb, var(--oc-text) 6%, transparent);
  }

  .prevnext-chevron {
    flex-shrink: 0;
    font-size: 1.1rem;
    line-height: 1;
    color: var(--oc-colors-text-subtext2);
  }

  .prevnext-textcol {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    min-width: 0;
  }
  .prevnext-card--next .prevnext-textcol {
    align-items: flex-end;
    text-align: right;
  }

  .prevnext-label {
    font-size: 0.7rem;
    line-height: 1.2;
    letter-spacing: normal;
    color: var(--oc-colors-text-subtext2);
  }
  .prevnext-name {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    max-width: 100%;
    min-width: 0;
    font-size: 0.9rem;
    line-height: 1.2;
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
    font-size: 0.7rem;
    font-weight: 700;
    line-height: 1;
    font-family: 'Fira Code', var(--font-mono);
  }

  @media (max-width: 1024px) {
    .prevnext-card {
      min-height: 56px;
      padding: 10px 14px;
    }
  }

  @media (max-width: 768px) {
    gap: 8px;
    padding-top: 20px;

    .prevnext-card {
      min-height: 48px;
      padding: 8px 10px;
      gap: 6px;
    }
    .prevnext-label,
    .prevnext-name {
      font-size: 12px;
    }
    .prevnext-method {
      font-size: 11px;
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
