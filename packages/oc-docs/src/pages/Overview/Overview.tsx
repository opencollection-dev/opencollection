import React, { useMemo } from 'react';
import type { OpenCollection } from '@opencollection/types';
import type { StructuredText } from '@opencollection/types/common/description';
import { useMarkdownRenderer } from '../../hooks';
import { getCollectionStats, hasCollectionConfiguration } from '../../utils/collectionOverview';
import { scriptsArrayToObject } from '../../utils/schemaHelpers';
import { getCollectionVariables } from '../../utils/request';
import { AUTH_MODE_LABELS } from '../../constants';
import { CollectionStats } from '../../components/CollectionStats/CollectionStats';
import { CollectionConfiguration } from '../../components/OverviewCollectionConfiguration/CollectionConfiguration';
import { EmptyState } from '../../ui/EmptyState/EmptyState';
import { PageWrapper } from '../../components/PageWrapper/PageWrapper';
import { Heading } from '../../components/Heading/Heading';
import { Section } from '../../components/Section/Section';
import { BookIcon } from '../../assets/icons';
import { StyledWrapper } from './StyledWrapper';

const getDocsContent = (docs: OpenCollection['docs']): string => {
  if (!docs) return '';
  return typeof docs === 'string' ? docs : (docs as StructuredText)?.content || '';
};

interface OverviewProps {
  collection: OpenCollection;
  testId?: string;
}

export const Overview: React.FC<OverviewProps> = ({ collection, testId = 'overview' }) => {
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
  const { preVars, postVars } = useMemo(() => getCollectionVariables(collection), [collection.request]);
  const version = collection.info?.version;
  const name = collection.info?.name || 'Untitled Collection';

  const docsHtml = useMemo(() => {
    const content = getDocsContent(collection.docs);
    return content ? md.render(content) : '';
  }, [collection.docs, md]);

  const hasOverview = Boolean(docsHtml);
  const hasConfig = useMemo(
    () => hasCollectionConfiguration(
      collection.request?.headers,
      collection.request?.auth,
      scripts,
      preVars.length > 0 || postVars.length > 0
    ),
    [collection.request, scripts, preVars, postVars]
  );

  return (
    <PageWrapper>
      <StyledWrapper className="overview" data-testid={testId}>
        <header className="overview-headline">
          <div>
            {version ? (
              <div className="overview-version" data-testid="overview-collection-version">{`Version : ${version}`}</div>
            ) : null}
            <Heading testId="overview-collection-name">{name}</Heading>
          </div>
        </header>

        <div className="overview-stats-row">
          <CollectionStats stats={stats} />
        </div>

        <div className="overview-body">
          <div className="overview-col-left">
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
                  preVars={preVars}
                  postVars={postVars}
                  authModeLabels={AUTH_MODE_LABELS}
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
