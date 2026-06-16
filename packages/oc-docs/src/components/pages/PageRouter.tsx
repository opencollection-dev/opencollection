/**
 * PageRouter (BRU-3188) — selects the page component by the active node's type
 * and wraps its body in PageLayout (breadcrumb + prev/next chrome). Unknown
 * slugs redirect to the overview. This is the routing half of the page-component
 * contract; page bodies are replaced by other lanes via the `PageType` map.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import type { PageProps, PageType } from '../../routing/types';
import { useActiveResolution } from '../../routing/hooks';
import { useAppSelector } from '../../store/hooks';
import { selectDocsCollection } from '../../store/slices/docs';
import PageLayout from './PageLayout';
import OverviewPage from './OverviewPage';
import EnvironmentsPage from './EnvironmentsPage';
import FolderPage from './FolderPage';
import RequestPage from './RequestPage';
import ScriptPage from './ScriptPage';

const PAGE_COMPONENTS: Record<PageType, React.FC<PageProps>> = {
  overview: OverviewPage,
  environments: EnvironmentsPage,
  folder: FolderPage,
  request: RequestPage,
  script: ScriptPage,
};

interface PageRouterProps {
  onOpenPlayground?: () => void;
}

const PageRouter: React.FC<PageRouterProps> = ({ onOpenPlayground }) => {
  const resolution = useActiveResolution();
  const collection = useAppSelector(selectDocsCollection);

  // Unknown slug (typo, stale link, item removed): send back to the overview.
  if (!resolution) return <Navigate to="/" replace />;

  const { entry, prev, next } = resolution;
  const Page = PAGE_COMPONENTS[entry.type];

  return (
    <PageLayout node={entry} prev={prev} next={next}>
      {collection && (
        <Page
          node={entry}
          prev={prev}
          next={next}
          collection={collection}
          onOpenPlayground={onOpenPlayground}
        />
      )}
    </PageLayout>
  );
};

export default PageRouter;
