import React from 'react';
import type { PageProps } from '../../routing/types';
import PlaceholderBody from './PlaceholderBody';

/**
 * Script page (BRU-3188 scaffold). Slot only — nothing in the schema routes to
 * a standalone script node yet (scripts render inside the request page). The
 * 'script' PageType + this component exist so a future script-only nav entry
 * has a home without touching the router.
 */
const ScriptPage: React.FC<PageProps> = ({ node }) => (
  <PlaceholderBody title={node.name} ownedBy="script slot (no route yet)" />
);

export default ScriptPage;
