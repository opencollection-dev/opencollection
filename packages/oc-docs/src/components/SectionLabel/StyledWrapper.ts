import styled from '@emotion/styled';

/**
 * Section label typography:
 *   Inter · Semi Bold (600) · 11px (0.6875rem) · 100% line-height · 1.4px tracking · uppercase.
 * Font size is in rem so it scales with the root font size.
 */
export const SectionLabelWrapper = styled.h2`
  margin: 0 0 0.75rem 0;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 0.6875rem;
  line-height: 1;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--oc-colors-text-subtext1);
`;
