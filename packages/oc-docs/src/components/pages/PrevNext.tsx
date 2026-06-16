/**
 * Prev/Next pagination chrome (BRU-3188) — owned by this lane, rendered by
 * PageLayout. Walks the collection's hierarchy + seq order (the sequence is
 * built in navModel), so reordering folders/requests is reflected here.
 *
 * Both cards share the same anatomy (label + name + method badge); only the
 * alignment flips. Each card fills its half of the row so the pair spans the
 * full content width.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import type { SeqNeighbor } from '../../routing/types';
import { getMethodColorVar } from '../../theme/methodColors';

const toPath = (slug: string) => `/${slug}`;

const cardStyle = (dir: 'prev' | 'next'): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  width: '100%',
  minHeight: 60,
  padding: '12px 16px',
  borderRadius: 10,
  border: '1px solid var(--oc-border-border1, var(--border-color))',
  textDecoration: 'none',
  alignItems: dir === 'next' ? 'flex-end' : 'flex-start',
  textAlign: dir === 'next' ? 'right' : 'left',
});

const labelStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--oc-text-muted, var(--text-secondary))',
};

const nameStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 600,
  color: 'var(--oc-text-primary, var(--text-primary))',
};

const MethodTag: React.FC<{ method?: string }> = ({ method }) =>
  method ? (
    <span style={{ color: getMethodColorVar(method), fontSize: '0.7rem', fontWeight: 700 }}>
      {method.toUpperCase()}
    </span>
  ) : null;

const Card: React.FC<{ dir: 'prev' | 'next'; neighbor: SeqNeighbor }> = ({ dir, neighbor }) => (
  <Link to={toPath(neighbor.slug)} style={cardStyle(dir)} data-testid={`${dir}-link`}>
    <span style={labelStyle}>{dir === 'prev' ? '‹ Previous' : 'Next ›'}</span>
    <span className="flex items-center gap-2" style={nameStyle}>
      {/* Mirror the badge: method before name on prev, after name on next. */}
      {dir === 'prev' ? (
        <>
          <MethodTag method={neighbor.method} />
          {neighbor.name}
        </>
      ) : (
        <>
          {neighbor.name}
          <MethodTag method={neighbor.method} />
        </>
      )}
    </span>
  </Link>
);

const PrevNext: React.FC<{ prev?: SeqNeighbor; next?: SeqNeighbor }> = ({ prev, next }) => {
  if (!prev && !next) return null;

  return (
    <nav
      className="oc-prevnext flex items-stretch gap-4"
      aria-label="Pagination"
      data-testid="prevnext"
    >
      <div className="flex" style={{ flex: 1 }}>
        {prev && <Card dir="prev" neighbor={prev} />}
      </div>
      <div className="flex justify-end" style={{ flex: 1 }}>
        {next && <Card dir="next" neighbor={next} />}
      </div>
    </nav>
  );
};

export default PrevNext;
