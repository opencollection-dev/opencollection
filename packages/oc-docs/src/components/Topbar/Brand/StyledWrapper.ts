import styled from '@emotion/styled';

/** Brand cluster: logo/avatar + collection name + version. */
export const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0; /* allow truncation */
  flex-shrink: 0;

  .oc-topbar__brand-logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    flex: none;
    overflow: hidden;
    border-radius: var(--oc-border-radius-base);

    img,
    svg {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .oc-topbar__brand-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    line-height: 1.1;
  }

  .oc-topbar__brand-name {
    font-size: var(--oc-font-size-md);
    font-weight: 600;
    color: var(--oc-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .oc-topbar__brand-version {
    font-size: var(--oc-font-size-xs);
    color: var(--oc-colors-text-muted, var(--oc-text));
    opacity: 0.7;
    white-space: nowrap;
  }
`;
