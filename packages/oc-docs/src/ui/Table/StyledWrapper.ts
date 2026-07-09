import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  width: 100%;
  border: 1px solid var(--oc-border-border1); /* #e5e5e5 */
  border-radius: 0.5rem;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  &:hover {
    scrollbar-color: var(--oc-scrollbar-color) transparent;
  }

  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 4px;
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: var(--oc-scrollbar-color);
  }

  .table-empty-message {
    margin: 0;
    font-family: var(--font-sans);
    font-weight: 500;
    font-style: italic;
    font-size: 0.8125rem;
    line-height: 1;
    color: var(--text-secondary);
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-sans);
    table-layout: fixed;
  }

  .table-caption {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .table-head-cell {
    padding: 0.55rem 0.9rem;
    font-weight: 600;
    font-size: 0.65625rem; /* 10.5px */
    line-height: 1;
    letter-spacing: 0.04375rem; /* 0.7px */
    text-transform: uppercase;
    text-align: left;
    color: var(--oc-colors-text-subtext0); /* #9b9b9b */
    border-bottom: 1px solid var(--oc-table-border); /* #efefef */
  }

  .table-group-cell {
    padding: 0.5625rem 0.875rem; /* 9px 14px */
    background: var(--oc-background-mantle);
    border-bottom: 1px solid var(--oc-table-border); /* #efefef */
    text-align: left;
  }

  .table-group-inner {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    line-height: 1.2;
    color: var(--text-primary);
  }

  .table-group-label {
    font-size: 0.75rem; /* 12px */
    font-weight: 600;
    color: var(--text-primary); /* #343434 */
    white-space: nowrap;
  }

  .table-group-badge,
  .table-group-meta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.125rem 0.375rem;
    border-radius: 0.375rem;
    font-family: var(--font-sans);
    font-size: 0.6875rem;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0;
    text-transform: none;
  }

  .table-group-badge {
    padding: 1px 8px;
    border-radius: 999px;
    font-size: 0.6875rem; /* 11px */
    font-weight: 600;
    color: var(--text-muted); /* #838383 */
    background: var(--oc-background-surface0); /* #f1f1f1 */
  }

  .table-group-meta {
    margin-left: auto;
    border: 1px solid var(--oc-border-border1);
    background: var(--oc-background-base);
    color: var(--text-muted);
  }

  .table-row-description:has(> .table-description-cell:empty) {
    display: none;
  }
  .table-row:not(:last-child):not(:has(+ .table-row-description > .table-description-cell:not(:empty))) {
    border-bottom: 1px solid var(--oc-table-border);
  }
  .table-row:has(+ .table-row-description:last-child > .table-description-cell:empty) {
    border-bottom: none;
  }
  .table-row-description:not(:last-child):has(> .table-description-cell:not(:empty)) {
    border-bottom: 1px solid var(--oc-table-border);
  }
  .table-row:has(+ .table-row-description > .table-description-cell:not(:empty)) .table-cell {
    padding-bottom: 0;
  }
  .table-description-cell {
    padding: 0 0.875rem 0.5rem;
  }
  .table-row--disabled {
    opacity: 0.55;
  }

  .table-cell {
    padding: 0.5rem 0.875rem; /* 8px 14px */
    font-size: 0.8125rem;
    line-height: 1.3;
    color: var(--text-primary);
    text-align: left;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .table-cell--right {
    text-align: right;
  }
  .table-cell--head {
    font-weight: 500;
  }
`;
