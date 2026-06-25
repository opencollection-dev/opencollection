import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  background-color: var(--oc-background-base);
  border: 1px solid var(--border-color);
  border-radius: 6px;

  &.code--muted {
    background-color: var(--oc-background-mantle);
    border-color: transparent;
  }
  &.code--muted .code-content,
  &.code--muted .code-content-numbered,
  &.code--muted .code-content--numbered {
    background-color: var(--oc-background-mantle);
  }

  .code-copy-floating {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.15s ease;
  }
  &:hover .code-copy-floating,
  .code-copy-floating:focus-visible {
    opacity: 1;
  }

  .code-content {
    background-color: var(--oc-background-base);
    color: var(--text-primary);
    scrollbar-width: thin;
    scrollbar-color: var(--oc-scrollbar-color) transparent;
  }

  .code-content::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  .code-content::-webkit-scrollbar-track {
    background: transparent;
  }
  /* Reuse the app-wide scrollbar token (theme-aware); same hover treatment as the
     global scrollbar in index.css. */
  .code-content::-webkit-scrollbar-thumb {
    background-color: var(--oc-scrollbar-color);
    border-radius: 4px;
  }
  .code-content::-webkit-scrollbar-thumb:hover {
    background-color: color-mix(in srgb, var(--oc-text) 20%, transparent);
  }

  .code-content pre {
    font-size: 0.75rem;
    color: var(--text-primary);
    line-height: 1.65;
  }
  .code-content code {
    color: var(--text-primary);
    font-size: 0.75rem;
  }

  .code-content-numbered {
    display: flex;
    align-items: stretch;
    background-color: var(--oc-background-base);
  }
  .code-line-numbers {
    flex-shrink: 0;
    padding: 0.5rem 0;
    text-align: right;
    user-select: none;
    color: var(--text-tertiary);
    opacity: 0.7;
  }
  .code-line-numbers span {
    display: block;
    padding: 0 0.625rem 0 0.75rem;
    font-family: 'Fira Code', var(--font-mono);
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1.65;
    letter-spacing: normal;
  }
  .code-content--numbered {
    flex: 1;
    min-width: 0;
    padding: 0.5rem 0.875rem 0.5rem 0;
    background-color: var(--oc-background-base);
  }
  .code-content--numbered pre,
  .code-content--numbered code {
    font-family: 'Fira Code', var(--font-mono);
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1.65;
    letter-spacing: normal;
  }
`;
