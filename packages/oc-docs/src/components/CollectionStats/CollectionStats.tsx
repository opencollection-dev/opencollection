import React from 'react';
import { Stat } from '../Stat/Stat';
import type { StatItem } from '../Stat/Stat';
import { CollectionStatsWrapper } from './StyledWrapper';

interface CollectionStatsProps {
  stats: StatItem[];
  testId?: string;
}

export const CollectionStats: React.FC<CollectionStatsProps> = ({ stats, testId = 'collection-stats' }) => {
  // Each stat card's test id extends the base testId (e.g. `collection-stats-stat`).
  const itemTestId = `${testId}-stat`;

  return (
    <CollectionStatsWrapper className="collection-stats" data-testid={testId}>
      {stats.map((stat, index) => (
        <Stat key={`${stat.label}-${index}`} label={stat.label} value={stat.value} testId={itemTestId} />
      ))}
    </CollectionStatsWrapper>
  );
};

export default CollectionStats;
