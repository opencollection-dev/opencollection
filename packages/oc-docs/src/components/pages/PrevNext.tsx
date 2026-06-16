/**
 * Prev/Next pagination chrome (BRU-3188) — owned by this lane, rendered by
 * PageLayout. Walks the collection's hierarchy + seq order (the sequence is
 * built in navModel), so reordering folders/requests is reflected here.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import type { SeqNeighbor } from '../../routing/types';
import { getMethodColorVar } from '../../theme/methodColors';

const toPath = (slug: string) => `/${slug}`;

const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: '12px 16px',
  borderRadius: 8,
  border: '1px solid var(--oc-border-border1, var(--border-color))',
  textDecoration: 'none',
  minWidth: 0,
  maxWidth: '48%',
};

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

const PrevNext: React.FC<{ prev?: SeqNeighbor; next?: SeqNeighbor }> = ({ prev, next }) => {
  if (!prev && !next) return null;

  return (
    <nav
      className="oc-prevnext flex items-stretch justify-between gap-4"
      aria-label="Pagination"
      data-testid="prevnext"
    >
      {prev ? (
        <Link to={toPath(prev.slug)} style={{ ...cardStyle, alignItems: 'flex-start' }} data-testid="prev-link">
          <span style={labelStyle}>‹ Previous</span>
          <span style={nameStyle}>{prev.name}</span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link
          to={toPath(next.slug)}
          style={{ ...cardStyle, alignItems: 'flex-end', textAlign: 'right' }}
          data-testid="next-link"
        >
          <span style={labelStyle}>Next ›</span>
          <span className="flex items-center gap-2" style={nameStyle}>
            {next.name} <MethodTag method={next.method} />
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
};

export default PrevNext;
