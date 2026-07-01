import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  border-top: 1px solid var(--oc-border-border1);
  background-color: var(--oc-background-base);

  .footer-by {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
    font-size: 11.5px;
    color: var(--oc-sidebar-muted);
  }

  .footer-logo {
    display: block;
    height: 20px;
    width: auto;
    color: var(--oc-colors-text-subtext1);
    transition: color 0.15s ease;
  }

  .footer-link:hover .footer-logo {
    color: var(--text-primary);
  }
`;
