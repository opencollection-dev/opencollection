import styled from '@emotion/styled';

/**
 * Sub-heading typography:
 *   Inter · Semi Bold (600) · 13px (0.8125rem) · 12px (0.75rem) line-height · 0 letter-spacing.
 * Font size is in rem so it scales with the root font size.
 */
export const SubHeadingWrapper = styled.h3`
  margin: 0 0 0.625rem 0;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 0.8125rem;
  line-height: 0.75rem;
  letter-spacing: normal;
  color: var(--text-primary);
`;
