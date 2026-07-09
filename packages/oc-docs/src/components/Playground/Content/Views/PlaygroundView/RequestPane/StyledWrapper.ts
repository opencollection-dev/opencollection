import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  height: 100%;
  background-color: var(--bg-primary);

  .oc-tabs .tabs {
    flex: 1 1 auto;
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .oc-tabs .tabs::-webkit-scrollbar {
    display: none;
  }
  .oc-tabs .tab {
    flex-shrink: 0;
  }

  .body-type-select {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .body-type-select .glyph {
    position: absolute;
    left: 8px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-secondary);
    pointer-events: none;
  }

  .body-type-select select {
    appearance: none;
    border: none;
    outline: none;
    cursor: pointer;
    background: transparent;
    color: var(--text-primary);
    font-size: 12px;
    font-weight: 500;
    padding: 2px 22px 2px 28px;
    border-radius: 5px;
    transition: background-color 0.15s ease;
  }

  .body-type-select select:hover {
    background: color-mix(in srgb, var(--oc-text) 6%, transparent);
  }

  .body-type-select .chevron {
    position: absolute;
    right: 8px;
    pointer-events: none;
  }
`;
