import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  background-color: var(--code-bg);
  border: 1px solid var(--oc-border-border1);
  border-radius: 8px;

  .code-copy-floating {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.3rem;
    border-radius: 4px;
    border: none;
    color: var(--oc-colors-text-muted);
    background-color: var(--oc-background-surface0);
    cursor: pointer;
    opacity: 0;
    transition: all 0.15s ease;
  }

  &:hover .code-copy-floating {
    opacity: 1;
  }

  .code-copy-floating:hover {
    color: var(--oc-text);
    background-color: var(--oc-background-surface1);
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
    background-color: color-mix(in srgb, var(--oc-text) 10%, transparent);
    border-radius: 4px;
  }

  .code-content:hover::-webkit-scrollbar-thumb {
    background-color: color-mix(in srgb, var(--oc-text) 20%, transparent);
  }

  .code-content::-webkit-scrollbar-thumb:hover {
    background-color: color-mix(in srgb, var(--oc-text) 30%, transparent);
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
`;