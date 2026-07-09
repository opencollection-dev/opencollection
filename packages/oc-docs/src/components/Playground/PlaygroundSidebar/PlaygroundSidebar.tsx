import React, { useState } from 'react';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import EnvSwitcher from '../../EnvSwitcher/EnvSwitcher';
import SidebarTree from '../../Docs/Sidebar/SidebarTree/SidebarTree';
import IconButton from '../../../ui/IconButton/IconButton';
import { SettingsIcon } from '../../../assets/icons';
import { StyledWrapper } from './StyledWrapper';

interface PlaygroundSidebarProps {
  collection: OpenCollectionCollection | null;
  activeSlug: string;
  uuidToSlug: Map<string, string>;
  onNavigate: (slug: string) => void;
  onToggleFolder: (uuid: string) => void;
  onOpenEnvironments: () => void;
  environmentsActive: boolean;
  onOpenCollection: () => void;
  collectionActive: boolean;
  testId?: string;
}

const PlaygroundSidebar: React.FC<PlaygroundSidebarProps> = ({
  collection,
  activeSlug,
  uuidToSlug,
  onNavigate,
  onToggleFolder,
  onOpenEnvironments,
  environmentsActive,
  onOpenCollection,
  collectionActive,
  testId = 'playground-sidebar',
}) => {
  const [collectionCollapsed, setCollectionCollapsed] = useState(false);
  const name = collection?.info?.name || 'Collection';

  return (
    <StyledWrapper data-testid={testId}>
      <div className="controls">
        <EnvSwitcher testId="playground-env-switcher" />
        <IconButton
          className={`env-settings${environmentsActive ? ' active' : ''}`}
          label="Environment settings"
          title="Environments"
          data-testid="playground-env-settings"
          onClick={onOpenEnvironments}
        >
          <SettingsIcon />
        </IconButton>
      </div>

      <div className="tree">
        {collection?.items ? (
          <SidebarTree
            items={collection.items}
            activeSlug={activeSlug}
            uuidToSlug={uuidToSlug}
            onNavigate={onNavigate}
            onToggleFolder={onToggleFolder}
            collectionRoot={{
              name,
              collapsed: collectionCollapsed,
              active: collectionActive,
              onToggle: () => setCollectionCollapsed((v) => !v),
              onClick: onOpenCollection,
              testId: 'sidebar-collection-root',
            }}
          />
        ) : null}
      </div>
    </StyledWrapper>
  );
};

export default PlaygroundSidebar;
