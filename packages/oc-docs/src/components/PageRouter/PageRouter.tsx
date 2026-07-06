import React, { useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { ScriptFile, Folder as FolderItem } from '@opencollection/types/collection/item';
import { useActiveResolution, useNavModel } from '../../routing/hooks';
import { useAppSelector } from '../../store/hooks';
import { selectDocsCollection } from '../../store/slices/docs';
import { getItemUuid } from '../../utils/itemUtils';
import { getAncestorsByUuid } from '../../utils/fileUtils';
import PrevNext from '../PrevNext/PrevNext';
import { PageWrapper } from '../PageWrapper/PageWrapper';
import { VariablesProvider } from '../../contexts/VariablesContext';
import { StyledWrapper } from './StyledWrapper';
import { Overview } from '../../pages/Overview/Overview';
import Request from '../../pages/Request/Request';
import Script from '../../pages/Script/Script';
import Folder from '../../pages/Folder/Folder';
import Environments from '../../pages/Environments/Environments';
import type { PageProps } from '../../routing/types';

interface PageRouterProps {
  onOpenPlayground?: () => void;
  testId?: string;
}

const PageRouter: React.FC<PageRouterProps> = ({ onOpenPlayground, testId = 'page' }) => {
  const resolution = useActiveResolution();
  const model = useNavModel();
  const collection = useAppSelector(selectDocsCollection);
  const navigate = useNavigate();

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

  if (!resolution) return <Navigate to="/" replace />;
  if (!collection) return null;

  const { entry, prev, next } = resolution;
  const pageProps: PageProps = { node: entry, prev, next, collection, onOpenPlayground };

  const goToUuid = (uuid: string) => {
    const slug = uuidToSlug.get(uuid);
    // A known item navigates to its slug; the leading collection crumb (and any
    // unknown uuid) falls back to the overview.
    navigate(slug !== undefined ? `/${slug}` : '/');
  };

  // Resolve the active node's item and its folder ancestry (used for breadcrumbs
  // and for resolving inherited auth/scripts up the folder chain).
  const item = entry.item;
  const ancestry = item ? getAncestorsByUuid(collection, getItemUuid(item) ?? '') : [];

  const renderBody = () => {
    switch (entry.type) {
      case 'overview':
        return <Overview collection={collection} />;
      case 'environments':
        return <Environments {...pageProps} />;
      case 'folder':
        return item ? (
          <Folder item={item as FolderItem} ancestry={ancestry} collection={collection} onBreadcrumbClick={goToUuid} />
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
          <Request
            item={item as HttpRequest}
            ancestry={ancestry}
            collection={collection}
            onTryClick={onOpenPlayground}
            onBreadcrumbClick={goToUuid}
          />
        ) : null;
    }
  };

  return (
    <StyledWrapper data-testid={testId} data-page-type={entry.type} data-page-slug={entry.slug}>
      <VariablesProvider collection={collection} item={item} ancestry={ancestry}>
        <div className="page-body">{renderBody()}</div>
      </VariablesProvider>
      <div className="page-footer">
        <PageWrapper>
          <PrevNext prev={prev} next={next} />
        </PageWrapper>
      </div>
    </StyledWrapper>
  );
};

export default PageRouter;
