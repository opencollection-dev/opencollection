import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  .request-description-body {
    color: var(--text-secondary);
  }
  &:not(.is-expanded):not(.is-animating) .request-description-body {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  &.is-animating .request-description-body {
    overflow: hidden;
    transition: max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: max-height;
  }
  @media (prefers-reduced-motion: reduce) {
    &.is-animating .request-description-body,
    .request-description-chevron {
      transition: none;
    }
  }
  .request-description-toggle {
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
  .request-description-chevron {
    flex-shrink: 0;
    transition: transform 0.15s ease;
  }
  &.is-expanded .request-description-chevron {
    transform: rotate(180deg);
  }
  .request-description-toggle:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    border-radius: 2px;
  }
`;
