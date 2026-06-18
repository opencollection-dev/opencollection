import styled from '@emotion/styled';

/**
 * 26×26 rounded badge with the collection initials. The amber gradient is a
 * FIXED brand mark (same treatment as the Bruno mascot) — it stays identical in
 * light and dark, matching the design, so it is intentionally not theme-tokened.
 * Mono font + tight tracking match the design's letterforms.
 */
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  flex: none;
  border-radius: var(--oc-border-radius-base);
  background: linear-gradient(135deg, #d37f17 0%, #dc9741 100%);
  color: #fff;
  font-family: var(--font-mono);
  font-size: var(--oc-font-size-xs);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  user-select: none;
`;
