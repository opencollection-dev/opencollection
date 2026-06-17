import React from 'react';
import { Stat } from '../Stat';
import type { StatItem } from '../Stat';
import { CollectionStatsWrapper } from './StyledWrapper';

interface CollectionStatsProps {
  stats: StatItem[];
}

/**
 * A row of labelled stats. Fully prop-driven (labels + values supplied by the host)
 * and composed from the atomic `Stat` component.
 */
export const CollectionStats: React.FC<CollectionStatsProps> = ({ stats }) => (
  <CollectionStatsWrapper className="collection-stats">
    {stats.map((stat, index) => (
      <Stat key={`${stat.label}-${index}`} label={stat.label} value={stat.value} />
    ))}
  </CollectionStatsWrapper>
);

export default CollectionStats;
