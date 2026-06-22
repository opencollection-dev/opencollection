import styled from '@emotion/styled';

export const RequestDescriptionWrapper = styled.div`
  .oc-request-description-body {
    color: var(--text-secondary);
  }
  /* Design: clamp the preview to 3 lines; "View more" reveals the rest. */
  &:not(.is-expanded) .oc-request-description-body {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  /* Design: "View more" — Inter, Medium 500, 13px, brand-text. */
  .oc-request-description-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    margin-top: 0.5rem;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: 0.8125rem;
    line-height: 1;
    letter-spacing: 0;
    color: var(--primary-text);
  }
  /* Chevron points down for "View more"; flips up when expanded ("View less"). */
  .oc-request-description-chevron {
    flex-shrink: 0;
    transition: transform 0.15s ease;
  }
  &.is-expanded .oc-request-description-chevron {
    transform: rotate(180deg);
  }
  .oc-request-description-toggle:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    border-radius: 2px;
  }
`;
