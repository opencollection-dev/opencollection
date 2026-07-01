import React from 'react';
import { Link } from 'react-router-dom';
import type { SeqNeighbor } from '../../routing/types';
import { getMethodColorVar } from '../../theme/methodColors';
import { getShortMethod } from '../../utils/request';
import { StyledWrapper } from './StyledWrapper';

const toPath = (slug: string) => `/${slug}`;

const MethodTag: React.FC<{ method?: string }> = ({ method }) =>
  method ? (
    <span className="prevnext-method" style={{ color: getMethodColorVar(method) }}>
      {getShortMethod(method)}
    </span>
  ) : null;

const Card: React.FC<{ dir: 'prev' | 'next'; neighbor: SeqNeighbor }> = ({ dir, neighbor }) => (
  <Link
    to={toPath(neighbor.slug)}
    className={`prevnext-card prevnext-card--${dir}`}
    data-testid={`${dir}-link`}
  >
    {dir === 'prev' && (
      <span className="prevnext-chevron" aria-hidden>
        ‹
      </span>
    )}
    <span className="prevnext-textcol">
      <span className="prevnext-label">{dir === 'prev' ? 'Previous' : 'Next'}</span>
      <span className="prevnext-name">
        <MethodTag method={neighbor.method} />
        <span className="prevnext-name-text">{neighbor.name}</span>
      </span>
    </span>
    {dir === 'next' && (
      <span className="prevnext-chevron" aria-hidden>
        ›
      </span>
    )}
  </Link>
);

export interface PrevNextProps {
  prev?: SeqNeighbor;
  next?: SeqNeighbor;
}

const PrevNext: React.FC<PrevNextProps> = ({ prev, next }) => {
  if (!prev && !next) return null;
  return (
    <StyledWrapper className="prevnext" aria-label="Pagination" data-testid="prevnext">
      <div className="prevnext-half">{prev && <Card dir="prev" neighbor={prev} />}</div>
      <div className="prevnext-half prevnext-half--next">
        {next && <Card dir="next" neighbor={next} />}
      </div>
    </StyledWrapper>
  );
};

export default PrevNext;
