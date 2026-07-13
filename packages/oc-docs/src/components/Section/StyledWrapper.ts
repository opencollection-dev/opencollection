import styled from '@emotion/styled';

export const StyledWrapper = styled.section`
  .section-head {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 1.25rem;
  }
  .section-head .section-head-label {
    margin-bottom: 0;
  }

  .section-toggle {
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
  .section-toggle:focus-visible {
    outline: 2px solid var(--oc-status-info-text);
    outline-offset: 2px;
    border-radius: 0.25rem;
  }
  .section-chevron {
    color: var(--text-muted);
  }

  /* The body's open/close height animation is handled by the shared <Collapse>. */
`;
