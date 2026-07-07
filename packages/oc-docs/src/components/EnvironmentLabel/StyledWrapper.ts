import styled from '@emotion/styled';

export const StyledWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;

  .environment-label-dot {
    width: 0.5rem;
    height: 0.5rem;
    box-sizing: border-box;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .environment-label-dot--empty {
    background: transparent;
    border: 1px solid var(--text-tertiary);
  }

  .environment-label-name {
    color: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
