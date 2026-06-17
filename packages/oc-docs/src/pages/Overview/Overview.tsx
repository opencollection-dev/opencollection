import React, { useMemo } from 'react';
import type { OpenCollection } from '@opencollection/types';
import type { StructuredText } from '@opencollection/types/common/description';
import { useMarkdownRenderer } from '../../hooks';
import { getCollectionStats } from '../../utils/collectionStats';
import { hasCollectionConfiguration } from '../../utils/collectionConfiguration';
import { scriptsArrayToObject } from '../../utils/schemaHelpers';
import { formatCollectionVersion } from '../../utils/common';
import { AUTH_MODE_LABELS } from '../../constants';
import { CollectionStats } from '../../components/CollectionStats';
import { EnvironmentSummary } from '../../components/EnvironmentSummary';
import { CollectionConfiguration } from '../../components/CollectionConfiguration';
import { EmptyState } from '../../components/EmptyState';
import { PageWrapper } from '../../components/PageWrapper';
import { Heading } from '../../components/Heading';
import { Section } from '../../components/Section';
import { GlobeIcon, BookIcon } from '../../assets/icons';
import { OverviewWrapper } from './StyledWrapper';

/** Extracts the markdown string from a collection's `docs` (string or structured text). */
const getDocsContent = (docs: OpenCollection['docs']): string => {
  if (!docs) return '';
  return typeof docs === 'string' ? docs : (docs as StructuredText)?.content || '';
};

interface OverviewProps {
  collection: OpenCollection;
}

/**
 * The collection Overview page. Acts as the composition root: it reads app constants
 * and utils, then passes plain data + config down to the atomic, package-ready
 * components (which import nothing app-specific).
 */
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
      <OverviewWrapper className="oc-overview">
        <header className="overview-headline">
          <div>
            {version && <div className="overview-version">{version}</div>}
            <Heading>{name}</Heading>
          </div>
        </header>

        <div className="overview-stats-row">
          <CollectionStats stats={stats} />
        </div>

        <div className="overview-body">
          <div className="overview-col-left">
            <Section label="Environments">
              {hasEnvironments ? (
                <EnvironmentSummary environments={environments} />
              ) : (
                <EmptyState
                  icon={<GlobeIcon />}
                  heading="No environments yet"
                  subheading="This collection has no environments configured. Add one in Bruno to manage base URLs and variables."
                />
              )}
            </Section>

            <Section label="Overview">
              {hasOverview ? (
                <div
                  className="overview-markdown markdown-documentation"
                  dangerouslySetInnerHTML={{ __html: docsHtml }}
                />
              ) : (
                <EmptyState
                  icon={<BookIcon />}
                  heading="No overview content yet"
                  subheading="This collection has no description or readme. Add one in Bruno to introduce your API to readers — what it does, who it's for, and how to authenticate."
                />
              )}
            </Section>
          </div>

          <div className="overview-col-right">
            <Section label="Collection Configuration">
              {hasConfig ? (
                <CollectionConfiguration
                  headers={collection.request?.headers}
                  auth={collection.request?.auth}
                  scripts={scripts}
                  authModeLabels={AUTH_MODE_LABELS}
                />
              ) : (
                <EmptyState
                  icon={<BookIcon />}
                  heading="No configuration set"
                  subheading="This collection has no shared headers, auth, scripts, variables, or tests. Configure them in Bruno and they'll appear here."
                />
              )}
            </Section>
          </div>
        </div>
      </OverviewWrapper>
    </PageWrapper>
  );
};

export default Overview;
