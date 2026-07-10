import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 52px;
  padding: 0 14px;
  border-bottom: 1px solid var(--oc-border-border0);
  background-color: var(--oc-background-base);

  .header-left,
  .header-right {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .header-brand {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }

  .header-brand svg {
    width: 18px;
    height: 18px;
  }

  .header-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .header-collapse svg {
    transition: transform 0.15s ease;
  }

  .header-collapse.collapsed svg {
    transform: rotate(180deg);
  }
`;
