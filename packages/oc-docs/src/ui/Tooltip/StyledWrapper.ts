import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  z-index: 1000;
  max-width: min(24rem, calc(100vw - 1rem));
  padding: 0.25rem 0.5rem;
  border-radius: var(--oc-radius);
  background: var(--text-primary);
  color: var(--oc-background-base);
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.35;
  white-space: normal;
  overflow-wrap: anywhere;
  box-shadow: 0 4px 12px var(--oc-info-tip-box-shadow);
  pointer-events: none;

  &.oc-tooltip--card {
    padding: 0.625rem;
    background: var(--oc-background-base);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
`;
