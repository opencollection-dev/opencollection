import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  max-width: 100%;
  background-color: var(--code-bg);
  border: 1px solid var(--oc-table-border);
  border-radius: 8px;

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
    background-color: var(--code-bg);
    color: var(--text-primary);
  }

  .code-content::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .code-content::-webkit-scrollbar-track {
    background: transparent;
  }
  .code-content::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  .code-content:hover::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
  }
  .code-content::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }

  .code-content pre {
    font-size: 13px;
    color: var(--text-primary);
    line-height: 1.65;
  }
  .code-content code {
    color: var(--text-primary);
    font-size: 13px;
  }

  .code-content-numbered {
    display: flex;
    align-items: stretch;
    background-color: var(--oc-bg);
  }
  .code-line-numbers {
    flex-shrink: 0;
    padding: 1rem 0 1rem 1rem;
    text-align: right;
    user-select: none;
    color: var(--text-tertiary);
  }
  .code-line-numbers span {
    display: block;
    font-family: 'Fira Code', var(--font-mono);
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1.65;
    letter-spacing: normal;
  }
  .code-content--numbered {
    flex: 1;
    min-width: 0;
    padding: 1rem 1rem 1rem 0.75rem;
    background-color: var(--background-light);
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
