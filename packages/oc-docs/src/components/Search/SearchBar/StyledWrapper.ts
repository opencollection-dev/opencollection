import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 27.5rem;
  height: 1.75rem;
  font-family: var(--font-sans);

  .search-panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background: var(--oc-background-mantle);
    border: 0.0625rem solid var(--oc-border-border0);
    border-radius: var(--oc-radius);
    overflow: hidden;
  }
  
  .search-panel:hover {
    border-color: var(--oc-border-border1);
  }

  .search-panel[data-open='true'] {
    /* Panel height cap; the scroll region below derives its own max-height from
       this so the two never desync. */
    --search-panel-max: min(28.375rem, calc(100vh - 4.5rem));
    z-index: var(--z-popover);
    top: -0.3125rem;
    left: 50%;
    transform: translateX(-50%);
    width: min(41.25rem, 92vw);
    max-height: var(--search-panel-max);
    background: var(--oc-background-base);
    border-color: var(--oc-border-border1);
    overflow: visible;
  }

  .search-inputrow {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    height: 1.75rem;
    padding: 0.4375rem 0.5rem;
    box-sizing: border-box;
    flex-shrink: 0;
  }
  .search-panel[data-open='true'] .search-inputrow {
    height: 2.5rem;
    padding: 0 0.75rem;
    gap: 0.5625rem;
    border-bottom: 0.0625rem solid var(--oc-border-border0);
  }

  .search-field-icon {
    flex-shrink: 0;
    display: inline-flex;
    color: var(--oc-colors-text-subtext0);
  }
  .search-field-icon svg {
    width: 0.75rem;
    height: 0.75rem;
  }
  .search-panel[data-open='true'] .search-field-icon {
    color: var(--oc-colors-text-subtext1);
  }

  .search-input {
    flex: 1 1 auto;
    min-width: 0;
    border: 0;
    outline: none;
    background: transparent;
    font-family: var(--font-sans);
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--oc-text);
  }
  .search-panel[data-open='true'] .search-input {
    font-size: 0.8125rem;
  }
  .search-input::placeholder {
    color: var(--oc-colors-text-subtext1);
  }

  .search-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    padding: 0;
    flex-shrink: 0;
    cursor: pointer;
    background: transparent;
    border: 0;
    border-radius: var(--oc-radius);
    color: var(--oc-colors-text-subtext1);
  }
  .search-close svg {
    width: 0.75rem;
    height: 0.75rem;
  }
  .search-close:hover {
    background: var(--oc-background-surface0);
  }

  .search-filters {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    flex-wrap: nowrap;
    height: 2.5rem;
    padding: 0 0.75rem;
    box-sizing: border-box;
    flex-shrink: 0;
    border-bottom: 0.0625rem solid var(--oc-border-border0);
  }
  [data-testid='search-folder-filter'],
  .search-clear {
    flex: 0 0 auto;
  }

  .search-clear {
    margin-left: auto;
    padding: 0.125rem 0.25rem;
    cursor: pointer;
    background: transparent;
    border: 0;
    font-family: var(--font-sans);
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--oc-colors-text-subtext1);
    white-space: nowrap;
  }
  .search-clear:hover {
    color: var(--oc-accents-primary);
  }

  /* Scroll region = panel cap minus the input row (2.5rem) and filter row
     (2.5rem), so it tracks whatever --search-panel-max resolves to per
     breakpoint. */
  .search-results {
    max-height: calc(var(--search-panel-max) - 5rem);
    overflow-y: auto;
    padding: 0.25rem;
    scroll-padding: 0.25rem;
  }

  .search-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .search-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 11.25rem;
    padding: 0 1.25rem;
    box-sizing: border-box;
    gap: 0.25rem;
  }
  .search-empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    margin-bottom: 0.625rem;
    border-radius: var(--oc-radius);
  }
  .search-empty-icon[data-tone='brand'] {
    background: color-mix(in srgb, var(--oc-accents-primary) 8%, transparent);
    color: var(--oc-accents-primary);
  }
  .search-empty-icon[data-tone='muted'] {
    background: var(--oc-background-surface0);
    color: var(--oc-colors-text-subtext1);
  }
  .search-empty-icon svg {
    width: 1.375rem;
    height: 1.375rem;
  }
  .search-empty-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--oc-text);
  }
  .search-empty-text {
    font-size: 0.78125rem;
    color: var(--oc-colors-text-subtext1);
    line-height: 1.5;
    max-width: 20rem;
  }
  .search-empty-text b {
    color: var(--oc-text);
    font-weight: 500;
  }
  .search-empty-clear {
    margin-top: 0.625rem;
    padding: 0.375rem 0.875rem;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--oc-accents-primary);
    background: color-mix(in srgb, var(--oc-accents-primary) 8%, transparent);
    border: 0;
    border-radius: var(--oc-radius);
  }

  /* Collapsed = the below-desktop layout (icon + reveal row), driven by the
     shell's docs-area-derived mode — not a viewport media query, because the
     inline playground can shrink the docs column while the window stays wide.
     The wrapper spans the full row so the absolute panel below centers within
     the docs area rather than on a left-aligned field. */
  &[data-collapsed='true'] {
    max-width: none;
    height: 0;
  }
  &[data-collapsed='true'] .search-panel[data-open='true'] {
    --search-panel-max: min(28.375rem, calc(100vh - 6rem));
    top: 0.375rem;
    width: min(41.25rem, calc(100% - 2rem));
  }
`;
