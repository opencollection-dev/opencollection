import React from 'react';
import { getMethodColorVar } from '../../../theme/methodColors';
import { getShortMethod } from '../../../utils/request';
import type { SearchRecord, FieldMatches } from '../searchIndex';
import { StyledWrapper } from './StyledWrapper';

interface SearchResultItemProps {
  record: SearchRecord;
  /** Matched character ranges per field, so each field bolds what matched. */
  matches?: FieldMatches;
  /** Whether this row is the active (keyboard-highlighted) result. */
  active?: boolean;
  /** Navigate to this result (caller also closes the palette). */
  onSelect: (record: SearchRecord) => void;
  testId?: string;
}

/**
 * Bold the `ranges` (inclusive [start, end] pairs from Fuse) inside `text`, so
 * each field advertises the exact substring that matched. The mark keeps the
 * field's own colour (weight is the only highlight signal). No ranges leaves
 * the text plain.
 */
const highlightRanges = (text: string, ranges?: Array<[number, number]>): React.ReactNode => {
  if (!ranges || ranges.length === 0) return text;
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  sorted.forEach(([start, end], i) => {
    if (start > cursor) nodes.push(text.slice(cursor, start));
    nodes.push(
      <b className="search-hl" key={i}>
        {text.slice(start, end + 1)}
      </b>
    );
    cursor = end + 1;
  });
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
};

/**
 * One result row in the search palette. The method is rendered as a plain
 * colour-coded mono label (not the filled sidebar badge) while still sourcing
 * its colour from the shared `getMethodColorVar` token so methods stay
 * consistent app-wide.
 */
export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  record,
  matches,
  active = false,
  onSelect,
  testId = 'search-result',
}) => (
  <StyledWrapper type="button" data-active={active} data-testid={testId} onClick={() => onSelect(record)}>
    {record.method && (
      <span
        className="search-result-method"
        data-testid={`${testId}-method`}
        style={{ ['--method-color' as string]: getMethodColorVar(record.method) }}
      >
        {getShortMethod(record.method)}
      </span>
    )}
    <span className="search-result-body">
      <span className="search-result-title-row">
        <span className="search-result-name">{highlightRanges(record.name, matches?.name)}</span>
        {record.breadcrumb && (
          <span className="search-result-breadcrumb">{highlightRanges(record.breadcrumb, matches?.breadcrumb)}</span>
        )}
      </span>
      {record.url && <span className="search-result-url">{highlightRanges(record.url, matches?.url)}</span>}
    </span>
  </StyledWrapper>
);

export default SearchResultItem;
