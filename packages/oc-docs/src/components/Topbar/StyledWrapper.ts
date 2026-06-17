import styled from '@emotion/styled';

/**
 * Topbar styling. Square bar (radius 0, bottom border only), rounded inner
 * controls (6px). Color surfaces map to `--oc-*` theme tokens so the bar honors
 * light/dark automatically; the popover elevation uses a neutral overlay shadow.
 *
 * Which controls render per breakpoint is decided in JSX (`Topbar` +
 * `useTopbarLayout`), not via CSS. `data-mode` (mobile | tablet | desktop) is
 * exposed on the host element for debugging and e2e targeting.
 */
export const StyledWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  width: 100%;
  box-sizing: border-box;
  font-family: var(--font-sans);
  background: var(--oc-background-base);
  border-bottom: 1px solid var(--oc-border-border1);

  .oc-topbar__bar {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 51px;
    padding: 0 20px;
    box-sizing: border-box;
  }

  /* ---- Brand ---- */
  .oc-topbar__brand {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0; /* allow truncation */
    flex-shrink: 0;
  }

  .oc-topbar__brand-logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    flex: none;
    overflow: hidden;
    border-radius: var(--oc-border-radius-base);

    img,
    svg {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .oc-topbar__brand-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    line-height: 1.1;
  }

  .oc-topbar__brand-name {
    font-size: var(--oc-font-size-md);
    font-weight: 600;
    color: var(--oc-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .oc-topbar__brand-version {
    font-size: var(--oc-font-size-xs);
    color: var(--oc-colors-text-muted, var(--oc-text));
    opacity: 0.7;
    white-space: nowrap;
  }

  /* ---- Slots ---- */
  .oc-topbar__search {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
    justify-content: center;
  }

  .oc-topbar__search-inner {
    width: 100%;
    max-width: 440px;
  }

  .oc-topbar__secondary {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .oc-topbar__spacer {
    flex: 1 1 auto;
  }

  /* ---- Icon buttons (hamburger / search toggle / overflow) ---- */
  .oc-topbar__icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    flex: none;
    background: transparent;
    color: var(--oc-colors-text-muted, var(--oc-text));
    border: 1px solid var(--oc-border-border1);
    border-radius: var(--oc-border-radius-base);
    cursor: pointer;
    transition: background-color 0.12s ease, color 0.12s ease, border-color 0.12s ease;

    svg {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background: var(--oc-background-surface0);
      color: var(--oc-text);
    }

    &[aria-expanded='true'] {
      background: var(--oc-background-surface0);
      color: var(--oc-text);
      border-color: var(--oc-border-border2, var(--oc-border-border1));
    }
  }

  /* ---- Mobile search row (revealed under the bar) ---- */
  .oc-topbar__search-row {
    display: flex;
    align-items: center;
    padding: 0 20px 10px;
    box-sizing: border-box;

    .oc-topbar__search-inner {
      max-width: none;
    }
  }

  /* ---- Mobile overflow popover ---- */
  .oc-topbar__overflow {
    position: relative;
    flex: none;
  }

  .oc-topbar__overflow-popover {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 40;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 220px;
    padding: 12px;
    box-sizing: border-box;
    background: var(--oc-background-base);
    border: 1px solid var(--oc-border-border1);
    border-radius: var(--oc-border-radius-base);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;
