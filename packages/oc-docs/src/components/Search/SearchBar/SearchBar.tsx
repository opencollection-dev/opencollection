import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavModel } from '../../../routing/hooks';
import { useClickOutside, useDocsNavigate } from '../../../hooks';
import {
  buildSearchRecords,
  collectTopLevelFolders,
  collectMethods,
  createSearchIndex,
  searchHits,
  type SearchHit,
  type SearchRecord,
} from '../searchIndex';
import { SearchIcon, CloseIcon } from '../../../assets/icons';
import MethodChips from '../MethodChips/MethodChips';
import FolderFilter from '../FolderFilter/FolderFilter';
import SearchResultItem from '../SearchResultItem/SearchResultItem';
import { StyledWrapper } from './StyledWrapper';

const RESULTS_ID = 'search-listbox';

// A single character can't clear Fuse's `minMatchCharLength`, so treat a query
// shorter than this as "not typing yet": keep the initial prompt rather than
// flashing "no matching requests" after the first keystroke.
const MIN_QUERY_LENGTH = 2;

interface SearchBarProps {
  /** Open state, controlled by the shell so it is shared with the Topbar's
   *  below-desktop search row (one source of truth: icon, row and panel agree). */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Changes on each hotkey press to refocus the field even when already open. */
  focusNonce?: number;
  /**
   * Below-desktop layout: the field is revealed as a full-width row, so the
   * panel widens to center within the docs area. Driven by the shell's
   * docs-area-derived mode rather than a viewport media query.
   */
  collapsed?: boolean;
  testId?: string;
}

/**
 * Header-anchored endpoint search. Typo-tolerant (Fuse/Bitap) search over name,
 * URL and folder chain plus palette-local method + folder filters. Results
 * render in the palette itself and selecting one navigates via the slug route.
 *
 * Expands in place (a combobox whose listbox drops directly below the field)
 * rather than opening a centered modal. Open state is controlled so the Topbar
 * search icon/row and this panel share one state (no redundant affordances).
 */
export const SearchBar: React.FC<SearchBarProps> = ({ open, onOpenChange, focusNonce, collapsed = false, testId = 'search' }) => {
  const docsNavigate = useDocsNavigate();
  const model = useNavModel();

  const records = useMemo(() => buildSearchRecords(model.ordered), [model]);
  const fuse = useMemo(() => createSearchIndex(records), [records]);
  const folders = useMemo(() => collectTopLevelFolders(model.ordered), [model]);
  // One chip per method present in the collection (canonical order).
  const methodOptions = useMemo(() => collectMethods(model.ordered), [model]);

  const [query, setQueryText] = useState('');
  const [methods, setMethods] = useState<Set<string>>(() => new Set());
  const [folder, setFolder] = useState<string | null>(null);
  // -1 = no keyboard selection yet, so no row shows the active highlight until
  // the user actually arrow-keys (mouse filtering shouldn't pre-highlight row 0).
  const [activeIdx, setActiveIdx] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const optionId = (i: number) => `${RESULTS_ID}-opt-${i}`;

  const hasQuery = query.trim().length >= MIN_QUERY_LENGTH;
  const hasFilter = methods.size > 0 || folder !== null;

  const results = useMemo<SearchHit[]>(() => {
    const base: SearchHit[] = hasQuery
      ? searchHits(fuse, query)
      : hasFilter
        ? records.map((record) => ({ record, matches: {} }))
        : [];
    return base.filter(
      ({ record: r }) =>
        (methods.size === 0 || (r.method ? methods.has(r.method.toUpperCase()) : false)) &&
        (folder === null || r.ancestorSlugs.includes(folder)),
    );
  }, [query, methods, folder, records, fuse, hasQuery, hasFilter]);

  useEffect(() => setActiveIdx(-1), [results]);

  // Focus the field whenever the panel opens (incl. when the Topbar icon mounts
  // this already-open below desktop, or the shortcut opens it from the shell).
  // `focusNonce` bumps on each hotkey press so ⌘K refocuses even when the panel
  // is already open and the field had lost focus.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, focusNonce]);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  useClickOutside(wrapperRef, close, open);

  // Filters are mouse-driven, which moves focus onto the clicked control; return
  // focus to the input so keyboard nav (arrows / Enter) keeps working after.
  const refocusInput = useCallback(() => inputRef.current?.focus(), []);

  const toggleMethod = useCallback(
    (method: string) => {
      setMethods((prev) => {
        const next = new Set(prev);
        if (next.has(method)) next.delete(method);
        else next.add(method);
        return next;
      });
      refocusInput();
    },
    [refocusInput],
  );

  const setFolderFilter = useCallback(
    (slug: string | null) => {
      setFolder(slug);
      refocusInput();
    },
    [refocusInput],
  );

  const clearFilters = useCallback(() => {
    setMethods(new Set());
    setFolder(null);
    refocusInput();
  }, [refocusInput]);

  // Reset query + filters and close. Keeps focus on the input (clearFilters
  // refocuses) so closing via ✕ / Escape leaves the field ready to type again.
  const resetAndClose = useCallback(() => {
    setQueryText('');
    clearFilters();
    onOpenChange(false);
  }, [clearFilters, onOpenChange]);

  const handleSelect = useCallback(
    (rec: SearchRecord) => {
      docsNavigate(rec.slug);
      resetAndClose();
      inputRef.current?.blur(); // navigating away, so drop focus from the palette
    },
    [docsNavigate, resetAndClose],
  );

  // Move the highlight and keep it in view. All option rows are already
  // rendered (activeIdx only toggles a class), so we can scroll imperatively
  // here rather than from an effect watching activeIdx.
  const moveActive = (delta: number) => {
    const next = Math.min(Math.max(activeIdx + delta, 0), results.length - 1);
    setActiveIdx(next);
    listRef.current?.children[next]?.scrollIntoView({ block: 'nearest' });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (query || hasFilter) resetAndClose();
      else onOpenChange(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) onOpenChange(true);
      moveActive(1);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActive(-1);
      return;
    }
    if (e.key === 'Enter') {
      // Enter selects the highlighted row, or the first result if none navigated.
      const hit = activeIdx >= 0 ? results[activeIdx] : results[0];
      if (hit) {
        e.preventDefault();
        handleSelect(hit.record);
      }
    }
  };

  const showInitial = !hasQuery && !hasFilter;

  return (
    <StyledWrapper ref={wrapperRef} role="search" data-collapsed={collapsed} data-testid={testId}>
      <div className="search-panel" data-open={open} data-testid="search-panel">
        <div className="search-inputrow">
          <span className="search-field-icon">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search endpoints…"
            value={query}
            role="combobox"
            aria-expanded={open}
            aria-controls={RESULTS_ID}
            aria-activedescendant={activeIdx >= 0 ? optionId(activeIdx) : undefined}
            aria-autocomplete="list"
            aria-label="Search endpoints"
            autoComplete="off"
            spellCheck={false}
            onFocus={() => onOpenChange(true)}
            onClick={() => onOpenChange(true)}
            onChange={(e) => {
              setQueryText(e.target.value);
              onOpenChange(true);
            }}
            onKeyDown={onKeyDown}
          />
          {open && (
            <button type="button" className="search-close" aria-label="Clear search" onClick={resetAndClose}>
              <CloseIcon />
            </button>
          )}
        </div>

        {open && (
          <>
            <div className="search-filters" data-testid="search-filters">
              <MethodChips methods={methodOptions} active={methods} onToggle={toggleMethod} />
              <FolderFilter folders={folders} value={folder} onChange={setFolderFilter} />
              {hasFilter && (
                <button type="button" className="search-clear" onClick={clearFilters}>
                  Clear all
                </button>
              )}
            </div>

            <div className="search-results" data-testid="search-scroll">
              {showInitial ? (
                <div className="search-empty">
                  <span className="search-empty-icon" data-tone="brand" aria-hidden="true">
                    <SearchIcon />
                  </span>
                  <p className="search-empty-title">Search the collection</p>
                  <p className="search-empty-text">Find any request by name, endpoint, or folder.</p>
                </div>
              ) : results.length === 0 ? (
                <div className="search-empty">
                  <span className="search-empty-icon" data-tone="muted" aria-hidden="true">
                    <SearchIcon />
                  </span>
                  <p className="search-empty-title">No matching requests</p>
                  <p className="search-empty-text">
                    Nothing matches {hasQuery ? <>“<b>{query}</b>”</> : 'these filters'}. Try a different
                    term or clear the filters.
                  </p>
                  {hasFilter && (
                    <button type="button" className="search-empty-clear" onClick={clearFilters}>
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <ul
                  ref={listRef}
                  className="search-list"
                  id={RESULTS_ID}
                  role="listbox"
                  aria-label="Search results"
                  data-testid="search-results"
                >
                  {results.map((hit, i) => (
                    <li
                      key={hit.record.id}
                      id={optionId(i)}
                      role="option"
                      aria-selected={i === activeIdx}
                      onMouseMove={(e) => {
                        // Only real pointer movement (not scroll-induced mousemove
                        // under a parked cursor) should steal the highlight.
                        if (e.movementX !== 0 || e.movementY !== 0) setActiveIdx(i);
                      }}
                    >
                      <SearchResultItem
                        record={hit.record}
                        matches={hit.matches}
                        active={i === activeIdx}
                        onSelect={handleSelect}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </StyledWrapper>
  );
};

export default SearchBar;
