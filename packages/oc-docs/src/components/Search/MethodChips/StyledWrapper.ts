import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 0 1 auto;
  min-width: 0;
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  .method-chip {
    flex: 0 0 auto;
    font-family: 'Fira Code', var(--font-mono);
    font-size: 10px;
    font-weight: 500;
    line-height: 1.3;
    letter-spacing: 0;
    padding: 4px 8px;
    cursor: pointer;
    color: var(--oc-colors-text-subtext1);
    background: transparent;
    border: 1px solid var(--oc-border-border2);
    border-radius: 6px;
    transition: border-color 0.12s ease, color 0.12s ease;
  }

  .method-chip:hover {
    color: var(--oc-text);
  }

  .method-chip[aria-pressed='true'] {
    color: var(--chip-color);
    border-color: var(--chip-color);
  }

  .method-chip:focus-visible {
    outline: 2px solid var(--oc-accents-primary);
    outline-offset: 1px;
  }
`;
