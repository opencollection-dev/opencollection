import React, { useRef, useState } from 'react';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import EnvSwitcher from '../../EnvSwitcher/EnvSwitcher';
import SidebarTree from '../../Docs/Sidebar/SidebarTree/SidebarTree';
import IconButton from '../../../ui/IconButton/IconButton';
import { SettingsIcon } from '../../../assets/icons';
import { useAutoHideScrollbar, useIsMobileDevice } from '../../../hooks';
import type { ExampleHighlight } from '../../Docs/Sidebar/SidebarTree/SidebarTree';
import { StyledWrapper } from './StyledWrapper';
import Tooltip from '../../../ui/Tooltip/Tooltip';

interface PlaygroundSidebarProps {
  collection: OpenCollectionCollection | null;
  activeSlug: string;
  uuidToSlug: Map<string, string>;
  onNavigate: (slug: string) => void;
  onToggleFolder: (uuid: string) => void;
  onExpandFolder: (uuid: string) => void;
  onOpenEnvironments: () => void;
  environmentsActive: boolean;
  onOpenCollection: () => void;
  collectionActive: boolean;
  testId?: string;
  activeExample: ExampleHighlight | null;
  onExampleClick?: (requestUuid: string, index: number) => void;
}

const PlaygroundSidebar: React.FC<PlaygroundSidebarProps> = ({
  collection,
  activeSlug,
  uuidToSlug,
  onNavigate,
  onToggleFolder,
  onExpandFolder,
  onOpenEnvironments,
  environmentsActive,
  onOpenCollection,
  collectionActive,
  testId = 'playground-sidebar',
  activeExample,
  onExampleClick,
}) => {
  const [collectionCollapsed, setCollectionCollapsed] = useState(false);
  const name = collection?.info?.name || 'Collection';

  // Show the scrollbar while the tree is in use, then fade it after 1s idle - same as the docs sidebar.
  const treeRef = useRef<HTMLDivElement>(null);
  useAutoHideScrollbar(treeRef);

  // Smaller nav text on real phones/tablets only, not by window size.
  const isMobileDevice = useIsMobileDevice();

  return (
    <StyledWrapper className={isMobileDevice ? 'mobile' : undefined} data-testid={testId}>
      <div className="controls">
        <EnvSwitcher testId="playground-env-switcher" />
        <Tooltip
          content='Configure Environments'
        >
        <IconButton
          className={`env-settings${environmentsActive ? ' active' : ''}`}
          label="Environment settings"
          aria-label='Environment settings'
          data-testid="playground-env-settings"
          onClick={onOpenEnvironments}
        >
          <SettingsIcon />
        </IconButton>
        </Tooltip>
      </div>

      <div className="tree" ref={treeRef}>
        {collection?.items ? (
          <SidebarTree
            items={collection.items}
            activeSlug={activeSlug}
            uuidToSlug={uuidToSlug}
            onNavigate={onNavigate}
            onToggleFolder={onToggleFolder}
            onExpandFolder={onExpandFolder}
            activeExample={activeExample}
            onExampleClick={onExampleClick}
            collectionRoot={{
              name,
              collapsed: collectionCollapsed,
              active: collectionActive,
              onToggle: () => setCollectionCollapsed((v) => !v),
              // Clicking the collection name opens its settings and reopens the
              // tree, the same way clicking a folder shows its contents.
              onClick: () => {
                setCollectionCollapsed(false);
                onOpenCollection();
              },
              testId: 'sidebar-collection-root',
            }}
          />
        ) : null}
      </div>
    </StyledWrapper>
  );
};

export default PlaygroundSidebar;
