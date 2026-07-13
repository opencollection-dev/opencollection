import React from 'react';
import { getMethodColorVar } from '../../../theme/methodColors';
import { getShortMethod } from '@utils/request';
import type { SearchRecord } from '@components/Search/searchIndex';
import { StyledWrapper } from './StyledWrapper';

interface SearchResultItemProps {
  record: SearchRecord;
  /** Whether this row is the active (keyboard-highlighted) result. */
  active?: boolean;
  /** Navigate to this result (caller also closes the palette). */
  onSelect: (record: SearchRecord) => void;
  testId?: string;
}

/**
 * One result row in the search palette. The method is rendered as a plain
 * colour-coded mono label (not the filled sidebar badge) while still sourcing
 * its colour from the shared `getMethodColorVar` token so methods stay
 * consistent app-wide.
 */
export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  record,
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
        <span className="search-result-name">{record.name}</span>
        {record.breadcrumb && <span className="search-result-breadcrumb">{record.breadcrumb}</span>}
      </span>
      {record.url && <span className="search-result-url">{record.url}</span>}
    </span>
  </StyledWrapper>
);

export default SearchResultItem;
