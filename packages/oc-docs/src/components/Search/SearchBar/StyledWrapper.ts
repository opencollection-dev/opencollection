import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 430px;
  height: 28px;
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
    border: 1px solid var(--oc-border-border0);
    border-radius: var(--oc-radius);
    overflow: hidden;
  }

  .search-panel[data-open='true'] {
    z-index: 10;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: min(660px, 92vw);
    max-height: min(454px, calc(100vh - 72px));
    background: var(--oc-background-base);
    border-color: var(--oc-border-border1);
    border-radius: var(--oc-radius);
    overflow: visible;
  }

  .search-inputrow {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 28px;
    padding: 7px 8px;
    box-sizing: border-box;
    flex-shrink: 0;
  }
  
  .search-panel:hover {
    border: 1px solid var(--oc-border-border1);
  }
 
  .search-panel[data-open='true'] .search-inputrow {
    height: 40px;
    padding: 0 12px;
    gap: 9px;
    border-bottom: 1px solid var(--oc-border-border0);
  }

  .search-field-icon {
    flex-shrink: 0;
    display: inline-flex;
    color: var(--oc-colors-text-subtext0);
  }
  .search-field-icon svg {
    width: 12px;
    height: 12px;
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
    font-size: 12px;
    font-weight: 400;
    color: var(--oc-text);
  }
  .search-panel[data-open='true'] .search-input {
    font-size: 13px;
  }
  .search-input::placeholder {
    color: var(--oc-colors-text-subtext1);
  }

  .search-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 0;
    flex-shrink: 0;
    cursor: pointer;
    background: transparent;
    border: 0;
    border-radius: var(--oc-radius);
    color: var(--oc-colors-text-subtext1);
  }
  .search-close svg {
    width: 12px;
    height: 12px;
  }
  .search-close:hover {
    background: var(--oc-background-mantle);
  }

  .search-filters {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: nowrap;
    height: 40px;
    padding: 0 12px;
    box-sizing: border-box;
    flex-shrink: 0;
    border-bottom: 1px solid var(--oc-border-border0);
  }
  [data-testid='search-folder-filter'],
  .search-clear {
    flex: 0 0 auto;
  }

  .search-clear {
    margin-left: auto;
    padding: 2px 4px;
    cursor: pointer;
    background: transparent;
    border: 0;
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 400;
    color: var(--oc-colors-text-subtext1);
    white-space: nowrap;
  }
  .search-clear:hover {
    color: var(--oc-accents-primary);
  }

  .search-results {
    max-height: 360px;
    overflow-y: auto;
    padding: 4px;
    scroll-padding: 4px;
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
    height: 180px;
    padding: 0 20px;
    box-sizing: border-box;
    gap: 4px;
  }
  .search-empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    margin-bottom: 10px;
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
    width: 22px;
    height: 22px;
  }
  .search-empty-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--oc-text);
  }
  .search-empty-text {
    font-size: 12.5px;
    color: var(--oc-colors-text-subtext1);
    line-height: 1.5;
    max-width: 320px;
  }
  .search-empty-text b {
    color: var(--oc-text);
    font-weight: 500;
  }
  .search-empty-clear {
    margin-top: 10px;
    padding: 6px 14px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    color: var(--oc-accents-primary);
    background: color-mix(in srgb, var(--oc-accents-primary) 8%, transparent);
    border: 0;
    border-radius: var(--oc-radius);
  }

  @media (max-width: 1023px) {
    max-width: none;
    height: 0;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    .search-panel[data-open='true'] {
      position: fixed;
      top: 56px;
      left: 50%;
      transform: translateX(-50%);
      width: min(660px, calc(100vw - 32px));
      max-height: min(454px, calc(100vh - 96px));
    }
  }

  @media (max-width: 767px) {
    .search-panel[data-open='true'] {
      position: fixed;
      top: 60px;
      left: 50%;
      right: auto;
      transform: translateX(-50%);
      width: min(660px, calc(100vw - 16px));
      max-height: min(70vh, calc(100vh - 96px));
    }
  }
`;
