/**
 * Breadcrumb chrome (BRU-3188) — owned by this lane, rendered by PageLayout.
 * Shows: <collection name> > <ancestor folders...> > <current>.
 * The collection-name crumb links to the overview; ancestor folders link to
 * their own pages; the current node is not a link.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import type { NavEntry } from '../../routing/types';
import { OVERVIEW_SLUG } from '../../routing/navModel';
import { useAppSelector } from '../../store/hooks';
import { selectDocsCollection } from '../../store/slices/docs';

const toPath = (slug: string) => `/${slug}`;

const Separator = () => (
  <span aria-hidden style={{ color: 'var(--oc-text-muted, var(--text-secondary))', opacity: 0.6 }}>
    ›
  </span>
);

const crumbStyle: React.CSSProperties = {
  color: 'var(--oc-text-muted, var(--text-secondary))',
  textDecoration: 'none',
  fontSize: '0.8rem',
};

const Breadcrumb: React.FC<{ node: NavEntry }> = ({ node }) => {
  const collection = useAppSelector(selectDocsCollection);
  const collectionName = collection?.info?.name || 'Overview';

  return (
    <nav
      className="oc-breadcrumb flex items-center gap-2 flex-wrap"
      aria-label="Breadcrumb"
      data-testid="breadcrumb"
    >
      <Link to={toPath(OVERVIEW_SLUG)} style={crumbStyle}>
        {collectionName}
      </Link>

      {node.ancestors.map((crumb) => (
        <React.Fragment key={crumb.slug}>
          <Separator />
          <Link to={toPath(crumb.slug)} style={crumbStyle}>
            {crumb.name}
          </Link>
        </React.Fragment>
      ))}

      <Separator />
      <span
        style={{ color: 'var(--oc-text-primary, var(--text-primary))', fontSize: '0.8rem', fontWeight: 500 }}
        aria-current="page"
      >
        {node.name}
      </span>
    </nav>
  );
};

export default Breadcrumb;
