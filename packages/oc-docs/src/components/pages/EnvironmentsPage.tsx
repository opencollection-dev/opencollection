import React from 'react';
import type { PageProps } from '../../routing/types';
import PlaceholderBody from './PlaceholderBody';

/** Environments page (BRU-3188 scaffold). Rich body owned by BRU-2548. */
const EnvironmentsPage: React.FC<PageProps> = ({ node }) => (
  <PlaceholderBody title={node.name} ownedBy="BRU-2548 (environments)" />
);

export default EnvironmentsPage;
