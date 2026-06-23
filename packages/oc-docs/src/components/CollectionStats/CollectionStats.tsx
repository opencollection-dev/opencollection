import React from 'react';
import { Stat } from '../Stat/Stat';
import type { StatItem } from '../Stat/Stat';
import { CollectionStatsWrapper } from './StyledWrapper';

interface CollectionStatsProps {
  stats: StatItem[];
  testId?: string;
  itemTestId?: string;
}

export const CollectionStats: React.FC<CollectionStatsProps> = ({ stats, testId, itemTestId }) => (
  <CollectionStatsWrapper className="collection-stats" data-testid={testId}>
    {stats.map((stat, index) => (
      <Stat key={`${stat.label}-${index}`} label={stat.label} value={stat.value} testId={itemTestId} />
    ))}
  </CollectionStatsWrapper>
);

export default CollectionStats;
