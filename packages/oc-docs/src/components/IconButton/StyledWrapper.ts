import styled from '@emotion/styled';

/**
 * Ghost icon button: no border; a hover/active background provides the
 * affordance. Colours map to `--oc-*` theme tokens. The `svg` is sized here so
 * any glyph passed as a child renders at a consistent 16px.
 */
export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  flex: none;
  background: transparent;
  color: var(--oc-colors-text-muted, var(--oc-text));
  border: none;
  border-radius: var(--oc-border-radius-base);
  cursor: pointer;
  transition: background-color 0.12s ease, color 0.12s ease;

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
  }
`;
