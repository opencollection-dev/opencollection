import styled from '@emotion/styled';

/**
 * Shared heading typography:
 *   Inter · Semi Bold (600) · 20px (1.25rem) · 100% line-height · -0.5px letter-spacing.
 * Font size is in rem so it scales with the root font size.
 */
export const HeadingWrapper = styled.h1`
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1;
  letter-spacing: -0.5px;
  color: var(--text-primary);
`;
