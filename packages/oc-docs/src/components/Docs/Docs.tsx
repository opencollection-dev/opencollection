import React, { useMemo } from 'react';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import Sidebar from './Sidebar/Sidebar';
import Overview from '../../pages/Overview/Overview';
import Request from '../../pages/Request/Request';
import Script from '../../pages/Script/Script';
import { findItemByUuid, getAncestorsByUuid } from '../../utils/fileUtils';
import { isHttpRequest, isScriptFile, isUnsupportedRequest } from '../../utils/schemaHelpers';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectSelectedItemId, selectItem } from '../../store/slices/docs';

interface DocsProps {
  docsCollection: OpenCollectionCollection | null;
  /** Retained for API compatibility; the sidebar reads collection items from the store. */
  filteredCollectionItems?: unknown[];
  onOpenPlayground?: () => void;
}

/**
 * Docs content shell: a sidebar plus the active page. An HTTP request shows its
 * detail page, a script file shows the script page; otherwise (a folder, or nothing
 * selected) we show the collection Overview. Selection flows through the Redux
 * `docs` slice.
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
        {docsCollection && (isHttpRequest(selected) || isUnsupportedRequest(selected)) ? (
          <Request
            item={selected}
            ancestry={ancestry}
            collection={docsCollection}
            onTryClick={() => onOpenPlayground?.()}
            onBreadcrumbClick={(uuid) => dispatch(selectItem(uuid))}
          />
        ) : docsCollection && isScriptFile(selected) ? (
          <Script
            item={selected}
            ancestry={ancestry}
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
