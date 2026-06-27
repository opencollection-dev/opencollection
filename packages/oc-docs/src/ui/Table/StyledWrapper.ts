import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  width: 100%;
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
    font-weight: 700;
    font-size: 0.6875rem;
    line-height: 1;
    letter-spacing: 0.0394rem;
    text-transform: uppercase;
    text-align: left;
    color: var(--oc-colors-text-subtext1);
    border-bottom: 1px solid var(--border-color);
  }

  .table-group-cell {
    padding: 0.65rem 0.9rem;
    font-size: 0.6875rem;
    line-height: 1;
    letter-spacing: 0.055rem;
    text-transform: uppercase;
    color: var(--oc-colors-text-subtext1);
    border-bottom: 1px solid var(--border-color);
    text-align: left;
  }

  .table-group-label {
    font-weight: 700;
    vertical-align: middle;
  }

  .table-group-badge,
  .table-group-meta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 0.5rem;
    padding: 0.125rem 0.25rem;
    border: 1px solid var(--oc-border-border0);
    border-radius: 0.25rem;
    background: transparent;
    font-family: var(--font-sans);
    font-size: 0.6875rem;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0;
    text-transform: none;
    color: var(--oc-colors-text-subtext1);
  }

  .table-group-badge {
    background: var(--oc-background-mantle);
    color: var(--text-muted);
  }

  .table-row:not(:last-child) {
    border-bottom: 1px solid var(--border-color);
  }
  .table-row--disabled {
    opacity: 0.55;
  }

  .table-cell {
    padding: 0.625rem 1rem;
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
