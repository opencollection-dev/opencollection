import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { ScriptFile, Folder as FolderItem } from '@opencollection/types/collection/item';
import { useActiveResolution, useNavModel } from '../../routing/hooks';
import { useAppSelector } from '../../store/hooks';
import { selectDocsCollection } from '../../store/slices/docs';
import { getItemUuid } from '../../utils/itemUtils';
import { getAncestorsByUuid } from '../../utils/fileUtils';
import { ItemVariableResolverProvider } from '../../hooks';
import type { Item } from '@opencollection/types/collection/item';
import PrevNext from '../PrevNext/PrevNext';
import PoweredByFooter from '../PoweredByFooter/PoweredByFooter';
import { PageWrapper } from '../PageWrapper/PageWrapper';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { StyledWrapper } from './StyledWrapper';
import { Overview } from '../../pages/Overview/Overview';
import Request from '../../pages/Request/Request';
import Script from '../../pages/Script/Script';
import Folder from '../../pages/Folder/Folder';
import Environments from '../../pages/Environments/Environments';
import type { PageProps } from '../../routing/types';
import { useDocsNavigate } from '../../hooks';

interface PageRouterProps {
  onOpenPlayground?: () => void;
  onTryExample?: (index: number) => void;
  testId?: string;
}

const PageRouter: React.FC<PageRouterProps> = ({ onOpenPlayground, onTryExample, testId = 'page' }) => {
  const resolution = useActiveResolution();
  const model = useNavModel();
  const collection = useAppSelector(selectDocsCollection);
  const docsNavigate = useDocsNavigate();

  // Map each item's runtime uuid -> its stable slug so breadcrumb clicks
  // navigate by URL (the same mapping the sidebar uses).
  const uuidToSlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const entry of model.ordered) {
      const uuid = getItemUuid(entry.item);
      if (uuid) map.set(uuid, entry.slug);
    }
    return map;
  }, [model]);

  const item = resolution?.entry?.item ?? null;
  const ancestry = useMemo(
    () => (item && collection ? getAncestorsByUuid(collection, getItemUuid(item) ?? '') : []),
    [collection, item]
  );

  if (!resolution) return <Navigate to="/" replace />;
  if (!collection) return null;

  const { entry, prev, next } = resolution;
  const pageProps: PageProps = { node: entry, prev, next, collection, onOpenPlayground };

  const goToUuid = (uuid: string) => {
    const slug = uuidToSlug.get(uuid);
    // A known item navigates to its slug; the leading collection crumb (and any
    // unknown uuid) falls back to the overview.
    docsNavigate(slug ?? '');
  };

  const renderBody = () => {
    switch (entry.type) {
      case 'overview':
        return <Overview collection={collection} />;
      case 'environments':
        return <Environments {...pageProps} />;
      case 'folder':
        return item ? (
          <ItemVariableResolverProvider collection={collection} ancestry={ancestry} item={item as Item}>
            <Folder item={item as FolderItem} ancestry={ancestry} collection={collection} onBreadcrumbClick={goToUuid} />
          </ItemVariableResolverProvider>
        ) : (
          <Overview collection={collection} />
        );
      case 'script':
        return item ? (
          <Script item={item as ScriptFile} ancestry={ancestry} collection={collection} onBreadcrumbClick={goToUuid} />
        ) : null;
      case 'request':
      default:
        return item ? (
          <ItemVariableResolverProvider collection={collection} ancestry={ancestry} item={item as Item}>
            <Request
              item={item as HttpRequest}
              ancestry={ancestry}
              collection={collection}
              onTryClick={onOpenPlayground}
              onBreadcrumbClick={goToUuid}
              highlightedExampleIndex={resolution.example?.index}
              onTryExample={onTryExample}
            />
          </ItemVariableResolverProvider>
        ) : null;
    }
  };

  return (
    <StyledWrapper data-testid={testId} data-page-type={entry.type} data-page-slug={entry.slug}>
      <div className="page-fill">
        <div className="page-body">
          <ErrorBoundary key={entry.slug}>{renderBody()}</ErrorBoundary>
        </div>
        <div className="page-footer">
          <PageWrapper>
            <PrevNext prev={prev} next={next} />
          </PageWrapper>
        </div>
      </div>
      <PoweredByFooter />
    </StyledWrapper>
  );
};

export default PageRouter;
