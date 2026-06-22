import React, { useMemo } from 'react';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import Sidebar from './Sidebar/Sidebar';
import Overview from '../../pages/Overview/Overview';
import Request from '../../pages/Request/Request';
import { findItemByUuid, getAncestorsByUuid } from '../../utils/itemTree';
import { isHttpRequest } from '../../utils/schemaHelpers';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectSelectedItemId, selectItem } from '../../store/slices/docs';

interface DocsProps {
  docsCollection: OpenCollectionCollection | null;
  /** Retained for API compatibility; the sidebar reads collection items from the store. */
  filteredCollectionItems?: unknown[];
  onOpenPlayground?: () => void;
}

/**
 * Docs content shell: a sidebar plus the active page. When an HTTP request is
 * selected we show its detail page; otherwise (a folder, or nothing selected) we
 * show the collection Overview. Selection flows through the Redux `docs` slice.
 */
const Docs: React.FC<DocsProps> = ({ docsCollection, onOpenPlayground }) => {
  const dispatch = useAppDispatch();
  const selectedItemId = useAppSelector(selectSelectedItemId);

  const selected = useMemo(
    () => (docsCollection && selectedItemId ? findItemByUuid(docsCollection.items, selectedItemId) : null),
    [docsCollection, selectedItemId]
  );

  const ancestry = useMemo(
    () => (docsCollection && selectedItemId ? getAncestorsByUuid(docsCollection, selectedItemId) : []),
    [docsCollection, selectedItemId]
  );

  return (
    <>
      <div
        className="playground-sidebar h-full overflow-hidden flex flex-shrink-0"
        style={{
          width: 'var(--sidebar-width)',
          transition: 'width 0.3s ease',
          borderRight: '1px solid var(--border-color)',
          backgroundColor: 'var(--oc-sidebar-bg)'
        }}
      >
        <Sidebar />
      </div>

      <div className="playground-content h-full overflow-y-auto flex-1">
        {docsCollection && isHttpRequest(selected) ? (
          <Request
            item={selected}
            ancestry={ancestry}
            collection={docsCollection}
            onTryClick={() => onOpenPlayground?.()}
            onBreadcrumbClick={(uuid) => dispatch(selectItem(uuid))}
          />
        ) : docsCollection ? (
          <Overview collection={docsCollection} />
        ) : null}
      </div>
    </>
  );
};

export default Docs;
