import React from 'react';
import type { PageProps } from '../../routing/types';
import type { Folder } from '@opencollection/types/collection/item';
import PlaceholderBody from './PlaceholderBody';

/** Folder page (BRU-3188 scaffold). Rich body (config sections) owned by other lanes. */
const FolderPage: React.FC<PageProps> = ({ node }) => {
  const count = (node.item as Folder | null)?.items?.length ?? 0;
  return (
    <PlaceholderBody title={node.name} ownedBy="folder page lane">
      <span
        style={{ color: 'var(--oc-text-muted, var(--text-secondary))', fontSize: '0.85rem' }}
        data-testid="folder-request-count"
      >
        {count} {count === 1 ? 'item' : 'items'}
      </span>
    </PlaceholderBody>
  );
};

export default FolderPage;
