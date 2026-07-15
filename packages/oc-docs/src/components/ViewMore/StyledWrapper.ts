import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  .view-more-content {
    overflow: hidden;
  }

  &:not(.is-expanded) .view-more-content {
    max-height: var(--view-more-collapsed);
  }

  &.is-overflowing:not(.is-expanded) .view-more-content {
    -webkit-mask-image: linear-gradient(to bottom, var(--oc-examples-button-icon-color) 82%, transparent);
    mask-image: linear-gradient(to bottom, var(--oc-examples-button-icon-color) 82%, transparent);
  }

  &.is-animating .view-more-content {
    transition: max-height 0.26s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: max-height;
  }

  @media (prefers-reduced-motion: reduce) {
    &.is-animating .view-more-content {
      transition: none;
    }
    .view-more-chevron {
      transition: none;
    }
  }

  .view-more-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    margin-top: 0.75rem;
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
  .view-more-chevron {
    flex-shrink: 0;
    transition: transform 0.15s ease;
  }
  .view-more-toggle[aria-expanded='true'] .view-more-chevron {
    transform: rotate(180deg);
  }
  .view-more-toggle:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    border-radius: 2px;
  }
`;
