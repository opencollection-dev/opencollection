import React, { useMemo } from 'react';
import type { OpenCollection } from '@opencollection/types';
import type { Item, Folder as FolderItem } from '@opencollection/types/collection/item';
import { useMarkdownRenderer } from '../../hooks';
import { AUTH_MODE_LABELS } from '../../constants';
import { getItemName, getItemDocs, getItemDescription } from '../../utils/schemaHelpers';
import { buildBreadcrumbSegments } from '../../utils/common';
import { getFolderConfig, hasFolderConfig, countFolderRequests } from '../../utils/folder';
import { PageWrapper } from '../../components/PageWrapper/PageWrapper';
import { Heading } from '../../components/Heading/Heading';
import { Section } from '../../components/Section/Section';
import { Breadcrumb, type BreadcrumbSegment } from '../../ui/Breadcrumb/Breadcrumb';
import { ViewMore } from '../../components/ViewMore/ViewMore';
import { EmptyState } from '../../ui/EmptyState/EmptyState';
import { FolderConfiguration } from '../../components/FolderConfiguration/FolderConfiguration';
import { FolderIcon } from '../../assets/icons';
import { StyledWrapper } from './StyledWrapper';

interface FolderProps {
  item: FolderItem;
  ancestry?: Item[];
  collection?: OpenCollection | null;
  onBreadcrumbClick?: (uuid: string) => void;
}

const requestCountLabel = (count: number): string => `${count} request${count === 1 ? '' : 's'}`;

export const Folder: React.FC<FolderProps> = ({ item, ancestry = [], collection, onBreadcrumbClick }) => {
  const md = useMarkdownRenderer();

  const name = getItemName(item) || 'Untitled Folder';
  const requestCount = useMemo(() => countFolderRequests(item), [item]);
  const config = useMemo(() => getFolderConfig(collection, ancestry, item), [collection, ancestry, item]);
  const showConfig = useMemo(() => hasFolderConfig(config), [config]);

  const docsHtml = useMemo(() => {
    const content = getItemDocs(item) || getItemDescription(item);
    return content ? md.render(content) : '';
  }, [item, md]);

  const segments = useMemo<BreadcrumbSegment[]>(
    () => buildBreadcrumbSegments(collection, ancestry),
    [collection, ancestry]
  );

  return (
    <PageWrapper>
      <StyledWrapper className="folder" data-testid="folder-page">
        <Breadcrumb segments={segments} current={name} onSegmentClick={onBreadcrumbClick} testId="folder-breadcrumb" />

        <header className="folder-header">
          <span className="folder-header-icon" aria-hidden="true">
            <FolderIcon />
          </span>
          <div className="folder-header-text">
            <Heading size="md" testId="folder-title">{name}</Heading>
            <span className="folder-header-count" data-testid="folder-request-count">
              {requestCountLabel(requestCount)}
            </span>
          </div>
        </header>

        {docsHtml && (
          <Section label="Documentation" testId="folder-section-documentation" className="folder-fullwidth">
            <ViewMore collapsedHeight="4.5rem" testId="folder-docs">
              <div className="markdown-documentation" dangerouslySetInnerHTML={{ __html: docsHtml }} />
            </ViewMore>
          </Section>
        )}

        <Section label="Folder Configuration" testId="folder-section-configuration" className="folder-fullwidth">
          {showConfig ? (
            <FolderConfiguration config={config} authModeLabels={AUTH_MODE_LABELS} testId="folder-config" />
          ) : (
            <EmptyState
              testId="folder-config-empty"
              icon={<FolderIcon />}
              heading="No folder configuration"
              subheading="This folder has no headers, auth, scripts, vars, or tests set. Requests inside it inherit configuration from the collection."
            />
          )}
        </Section>
      </StyledWrapper>
    </PageWrapper>
  );
};

export default Folder;
