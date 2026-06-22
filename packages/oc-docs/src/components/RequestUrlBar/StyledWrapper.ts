import styled from '@emotion/styled';

export const RequestUrlBarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  /* Design: 6px/8px padding, 8px radius, 1px border (#e5e5e5), mantle fill. */
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--oc-background-mantle);

  .oc-request-url-bar-method {
    flex-shrink: 0;
  }
  /* Design: method label is mono, Bold 700, 12px, brand-coloured (MethodBadge default). */
  .oc-request-url-bar-method .oc-method-badge {
    font-size: 0.75rem;
    line-height: 1.125rem;
    letter-spacing: 0.04em;
  }
  /* Design: URL is mono, 12px, single line with ellipsis; {{var}} tokens render as
     brand chips via VariableText (which inherits this mono family). */
  .oc-request-url-bar-url {
    flex: 1;
    min-width: 0;
    font-family: var(--font-mono);
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1.125rem;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .oc-request-url-bar-actions {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }
  /* Figma: fixed 24px height, 6px radius, 8px horizontal padding, 5px gap; label is
     Inter, Semi Bold 600, 12px, 100% line-height, 0 letter-spacing. */
  .oc-request-try {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.3125rem;
    height: 1.5rem;
    padding: 0 0.5625rem;
    border: 1px solid var(--oc-brand);
    border-radius: var(--oc-radius);
    background-color: var(--oc-brand);
    color: var(--oc-background-base);
    font-family: var(--font-sans);
    font-weight: 600;
    font-size: 0.71875rem;
    line-height: 1;
    letter-spacing: 0;
    white-space: nowrap;
    cursor: pointer;
  }
  .oc-request-try:hover {
    opacity: 0.92;
  }
  .oc-request-try:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
`;
