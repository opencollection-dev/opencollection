import React from 'react';
import { Stat } from './Stat/Stat';
import type { StatItem } from './Stat/Stat';
import { StyledWrapper } from './StyledWrapper';

interface CollectionStatsProps {
  stats: StatItem[];
  testId?: string;
}

export const CollectionStats: React.FC<CollectionStatsProps> = ({ stats, testId = 'collection-stats' }) => {
  const itemTestId = `${testId}-stat`;

  return (
    <StyledWrapper className="collection-stats" data-testid={testId}>
      {stats.map((stat, index) => (
        <Stat key={`${stat.label}-${index}`} label={stat.label} value={stat.value} testId={itemTestId} />
      ))}
    </StyledWrapper>
  );
};

export default CollectionStats;
