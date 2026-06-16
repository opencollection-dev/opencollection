/**
 * PageLayout (BRU-3188) — the chrome around every page body. THIS lane owns
 * the breadcrumb (top) and prev/next (bottom); the page BODY (children) is
 * built by other lanes (BRU-3569/3571/2548). Keeps a readable max-width and
 * fluid padding so content stays usable from mobile to large screens.
 */

import React from 'react';
import type { NavEntry, SeqNeighbor } from '../../routing/types';
import Breadcrumb from './Breadcrumb';
import PrevNext from './PrevNext';

interface PageLayoutProps {
  node: NavEntry;
  prev?: SeqNeighbor;
  next?: SeqNeighbor;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ node, prev, next, children }) => {
  const showBreadcrumb = node.type !== 'overview';

  return (
    <div
      className="oc-page flex flex-col min-h-full"
      data-testid="page"
      data-page-type={node.type}
      data-page-slug={node.slug}
      style={{
        maxWidth: '80rem',
        margin: '0 auto',
        padding: 'clamp(16px, 4vw, 40px) clamp(16px, 4vw, 40px) 20px',
        gap: 24,
      }}
    >
      {showBreadcrumb && <Breadcrumb node={node} />}

      <div className="oc-page-body flex-1">{children}</div>

      <PrevNext prev={prev} next={next} />
    </div>
  );
};

export default PageLayout;
