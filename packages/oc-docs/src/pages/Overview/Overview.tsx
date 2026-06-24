import React, { useMemo } from 'react';
import type { OpenCollection } from '@opencollection/types';
import type { StructuredText } from '@opencollection/types/common/description';
import { useMarkdownRenderer } from '../../hooks';
import { getCollectionStats } from '../../utils/collectionStats';
import { hasCollectionConfiguration } from '../../utils/collectionConfiguration';
import { scriptsArrayToObject } from '../../utils/schemaHelpers';
import { formatCollectionVersion } from '../../utils/common';
import { AUTH_MODE_LABELS } from '../../constants';
import { CollectionStats } from '../../components/CollectionStats/CollectionStats';
import { EnvironmentSummary } from '../../components/OverviewEnvironments/EnvironmentSummary/EnvironmentSummary';
import { CollectionConfiguration } from '../../components/OverviewCollectionConfiguration/CollectionConfiguration';
import { EmptyState } from '../../ui/EmptyState/EmptyState';
import { PageWrapper } from '../../ui/PageWrapper/PageWrapper';
import { Heading } from '../../ui/Heading/Heading';
import { Section } from '../../components/Section/Section';
import { GlobeIcon, BookIcon } from '../../assets/icons';
import { StyledWrapper } from './StyledWrapper';

const getDocsContent = (docs: OpenCollection['docs']): string => {
  if (!docs) return '';
  return typeof docs === 'string' ? docs : (docs as StructuredText)?.content || '';
};

interface OverviewProps {
  collection: OpenCollection;
}

export const Overview: React.FC<OverviewProps> = ({ collection }) => {
  const md = useMarkdownRenderer();

  const counts = useMemo(() => getCollectionStats(collection), [collection]);
  const stats = useMemo(
    () => [
      { label: 'Requests', value: counts.requestCount },
      { label: 'Folders', value: counts.folderCount },
      { label: 'Environments', value: counts.environmentCount }
    ],
    [counts]
  );
  const scripts = useMemo(() => scriptsArrayToObject(collection.request?.scripts), [collection.request]);
  const version = formatCollectionVersion(collection.info?.version);
  const name = collection.info?.name || 'Untitled Collection';
  const environments = collection.config?.environments ?? [];

  const docsHtml = useMemo(() => {
    const content = getDocsContent(collection.docs);
    return content ? md.render(content) : '';
  }, [collection.docs, md]);

  const hasEnvironments = environments.length > 0;
  const hasOverview = Boolean(docsHtml);
  const hasConfig = useMemo(
    () => hasCollectionConfiguration(collection.request?.headers, collection.request?.auth, scripts),
    [collection.request, scripts]
  );

  return (
    <PageWrapper>
      <StyledWrapper className="oc-overview" data-testid="overview">
        <header className="overview-headline">
          <div>
            {version && <div className="overview-version" data-testid="overview-collection-version">{version}</div>}
            <Heading testId="overview-collection-name">{name}</Heading>
          </div>
        </header>

        <div className="overview-stats-row">
          <CollectionStats stats={stats} />
        </div>

        <div className="overview-body">
          <div className="overview-col-left">
            <Section label="Environments" testId="overview-section-label">
              {hasEnvironments ? (
                <EnvironmentSummary
                  environments={environments}
                  testId="overview-environment-list"
                  itemTestId="overview-environment-item"
                />
              ) : (
                <EmptyState
                  testId="overview-empty"
                  icon={<GlobeIcon />}
                  heading="No environments yet"
                  subheading="This collection has no environments configured. Add one in Bruno to manage base URLs and variables."
                />
              )}
            </Section>

            <Section label="Overview" testId="overview-section-label">
              {hasOverview ? (
                <div
                  className="overview-markdown markdown-documentation"
                  data-testid="overview-markdown-documentation"
                  dangerouslySetInnerHTML={{ __html: docsHtml }}
                />
              ) : (
                <EmptyState
                  testId="overview-empty"
                  icon={<BookIcon />}
                  heading="No overview content yet"
                  subheading="This collection has no description or readme. Add one in Bruno to introduce your API to readers — what it does, who it's for, and how to authenticate."
                />
              )}
            </Section>
          </div>

          <div className="overview-col-right">
            <Section label="Collection Configuration" testId="overview-section-label">
              {hasConfig ? (
                <CollectionConfiguration
                  headers={collection.request?.headers}
                  auth={collection.request?.auth}
                  scripts={scripts}
                  authModeLabels={AUTH_MODE_LABELS}
                  testId="overview-config"
                />
              ) : (
                <EmptyState
                  testId="overview-empty"
                  icon={<BookIcon />}
                  heading="No configuration set"
                  subheading="This collection has no shared headers, auth, scripts, variables, or tests. Configure them in Bruno and they'll appear here."
                />
              )}
            </Section>
          </div>
        </div>
      </StyledWrapper>
    </PageWrapper>
  );
};

export default Overview;
