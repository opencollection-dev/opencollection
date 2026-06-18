import React from 'react';
import { Stat } from '../Stat';
import type { StatItem } from '../Stat';
import { CollectionStatsWrapper } from './StyledWrapper';

interface CollectionStatsProps {
  stats: StatItem[];
  /** Test hook (`data-testid`) for the row container. */
  testId?: string;
  /** Test hook applied to every `Stat` (its value cell gets `${itemTestId}-value`). */
  itemTestId?: string;
}

/**
 * A row of labelled stats. Fully prop-driven (labels + values supplied by the host)
 * and composed from the atomic `Stat` component.
 */
export const CollectionStats: React.FC<CollectionStatsProps> = ({ stats, testId, itemTestId }) => (
  <CollectionStatsWrapper className="collection-stats" data-testid={testId}>
    {stats.map((stat, index) => (
      <Stat key={`${stat.label}-${index}`} label={stat.label} value={stat.value} testId={itemTestId} />
    ))}
  </CollectionStatsWrapper>
);

export default CollectionStats;
