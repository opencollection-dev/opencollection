import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  position: relative;
  width: 100%;

  &.highlight-input .text-input {
    display: block;
    position: relative;
    width: 100%;
    border: 0.0625rem solid transparent;
    outline: none;
    background-color: transparent;
    color: transparent;
    caret-color: var(--oc-table-input-color);
    padding: 0.625rem;
    font-size: 0.8125rem;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0;
    border-radius: 0.25rem;
    transition: all 0.15s ease;
    font-family: inherit;
    vertical-align: middle;
  }

  &.highlight-input .text-input:focus {
    outline: none;
  }

  &.highlight-input .text-input::placeholder {
    color: var(--oc-colors-text-subtext0);
    opacity: 0.6;
  }

  .highlight-input-mirror {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    white-space: pre;
    padding: 0.625rem;
    border: 0.0625rem solid transparent;
    border-radius: 0.25rem;
    font-family: inherit;
    font-size: 0.8125rem;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0;
    color: var(--oc-table-input-color);
  }

  .highlight-input-mirror .variable-valid {
    color: var(--oc-codemirror-variable-valid);
  }

  .highlight-input-mirror .variable-invalid {
    color: var(--oc-codemirror-variable-invalid);
  }

  .highlight-input-mirror .variable-prompt {
    color: var(--oc-codemirror-variable-prompt);
  }
`;

export const HoverCard = styled.div`
  position: fixed;
  z-index: var(--z-popover, 1000);
  pointer-events: auto;
`;

export const Suggestions = styled.ul`
  position: fixed;
  z-index: var(--z-popover, 1000);
  margin: 0;
  padding: 0.25rem;
  list-style: none;
  max-height: 12.5rem;
  overflow-y: auto;
  background: var(--bg-primary);
  border: 0.0625rem solid var(--border-color);
  border-radius: var(--oc-radius);
  box-shadow: var(--shadow-md);
  font-family: var(--font-sans);
  font-size: 0.75rem;
  pointer-events: auto;

  .highlight-input-suggestion {
    padding: 0.25rem 0.5rem;
    border-radius: var(--oc-radius);
    color: var(--text-primary);
    line-height: 1.25rem;
    white-space: nowrap;
    cursor: pointer;
  }

  .highlight-input-suggestion.is-active {
    background: var(--brand-soft);
    color: var(--text-primary);
  }
`;
