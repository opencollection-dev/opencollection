import styled from '@emotion/styled';

export const StyledWrapper = styled.section`
  .oc-section-head {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.75rem;
  }
  .oc-section-head .oc-section-head-label {
    margin-bottom: 0;
  }

  .oc-section-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0;
    margin: 0;
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
    color: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
  }
  .oc-section-toggle:focus-visible {
    outline: 2px solid var(--oc-status-info-text);
    outline-offset: 2px;
    border-radius: 0.25rem;
  }
  .oc-section-chevron {
    color: var(--text-muted);
  }

  /* Body opens/closes with a height animation (grid-rows 0fr → 1fr). */
  .oc-section-body {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.25s ease;
  }
  .oc-section-body.is-open {
    grid-template-rows: 1fr;
  }
  .oc-section-body-clip {
    overflow: hidden;
    min-height: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .oc-section-body {
      transition: none;
    }
  }
`;
