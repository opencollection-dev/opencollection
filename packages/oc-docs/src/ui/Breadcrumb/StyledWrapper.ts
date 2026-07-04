import styled from '@emotion/styled';

export const StyledWrapper = styled.nav`
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;
    font-family: var(--font-sans);
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1;
    letter-spacing: 0;
  }
  li {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }
  .breadcrumb-sep {
    color: var(--oc-breadcrumb-color-segments, var(--text-secondary));
  }
  .breadcrumb-link {
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    font: inherit;
    color: var(--oc-breadcrumb-color-segments, var(--text-secondary));
  }
  .breadcrumb-link:hover {
    color: var(--oc-breadcrumb-color-current, var(--text-primary));
    text-decoration: underline;
  }
  .breadcrumb-link:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    border-radius: 2px;
  }
  .breadcrumb-current {
    color: var(--oc-breadcrumb-color-current, var(--primary-text));
  }
`;
