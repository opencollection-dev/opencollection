import styled from '@emotion/styled';

/**
 * Borderless brand-colored trigger + muted caret, ported from bruno-app's
 * RequestBodyMode (theme.primary.text label, muted caret).
 */
export const TriggerButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0 0 0.25rem;
  background: transparent;
  border: none;
  font-family: inherit;
  font-size: 0.75rem;
  line-height: 1.125rem;
  letter-spacing: 0;
  color: var(--oc-primary-text);
  cursor: pointer;
  user-select: none;

  .body-mode-caret {
    margin-left: 0.25rem;
    color: var(--oc-colors-text-muted);
  }
`;
