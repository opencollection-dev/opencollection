import styled from '@emotion/styled';

export const CollectionStatsWrapper = styled.div`
  display: flex;
  align-items: stretch;

  .stat:not(:first-child) {
    margin-left: 1.5rem;
    padding-left: 1.5rem;
    border-left: 1px solid var(--border-color);
  }
`;
