import styled from '@emotion/styled';

/**
 * Muted pill used for section-heading badges ("Inherited from collection",
 * content types like "application/json", etc.).
 * Figma: Inter · Medium 500 · 11px (0.6875rem) · 100% line-height · 4px radius ·
 * #838383 text on a #F1F1F1 fill — both via dark-safe theme tokens.
 */
export const ContentTypeBadgeWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.45rem;
  border-radius: 0.25rem;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: 0.6875rem;
  line-height: 1;
  color: var(--oc-colors-text-muted);
  background-color: var(--badge-bg);
`;
