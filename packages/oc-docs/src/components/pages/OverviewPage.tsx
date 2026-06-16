import React from 'react';
import type { PageProps } from '../../routing/types';
import PlaceholderBody from './PlaceholderBody';

/** Overview page (BRU-3188 scaffold). Rich body owned by BRU-3571. */
const OverviewPage: React.FC<PageProps> = ({ node }) => (
  <PlaceholderBody title={node.name} ownedBy="BRU-3571 (overview)" />
);

export default OverviewPage;
