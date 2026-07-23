import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import type { Item } from '@opencollection/types/collection/item';
import { requestRunner } from '../../../../../runner';
import { getAncestorsByUuid } from '../../../../../utils/fileUtils';
import { ItemVariableResolverProvider } from '../../../../../hooks';
import TitleLabel from '../../../../TitleLabel/TitleLabel';
import QueryBar from './QueryBar/QueryBar';
import RequestPane from './RequestPane/RequestPane';
import ResponsePane from './ResponsePane/ResponsePane';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { updatePlaygroundItem, setPlaygroundResponse, selectPlaygroundResponse } from '../../../../../store/slices/playground';
import { getItemName, isUnsupportedRequest } from '../../../../../utils/schemaHelpers';
import UnsupportedRequest from '../../../../UnsupportedRequest/UnsupportedRequest';
import { FileNotFoundIcon } from '../../../../../assets/icons';
import { useSplitPane } from '../../../../../hooks/useSplitPane';
import { SplitDivider } from '../../../../SplitDivider/SplitDivider';

interface PlaygroundViewProps {
  item: HttpRequest;
  collection: OpenCollectionCollection;
  selectedEnvironment?: string;
  orientation?: 'horizontal' | 'vertical';
}

const HttpRequestPlaygroundView: React.FC<PlaygroundViewProps> = ({ item, collection, selectedEnvironment = '', orientation = 'horizontal' }) => {
  const dispatch = useAppDispatch();
  const [editableItem, setEditableItem] = useState<HttpRequest>(item);
  const itemName = getItemName(editableItem) || 'Untitled Request';
  const itemUuid = (item as any).uuid;
  const response = useAppSelector(state => selectPlaygroundResponse(state, itemUuid));
  const [isLoading, setIsLoading] = useState(false);
  // The request/response split is one draggable divider whose axis follows the
  // orientation: horizontal layout resizes width, vertical layout resizes height.
  const { size: paneSize, isResizing, containerRef, startResize } = useSplitPane(orientation);
  const runner = useMemo(() => requestRunner, []);
  const ancestry = useMemo(
    () => (collection && itemUuid ? getAncestorsByUuid(collection, itemUuid) : []),
    [collection, itemUuid]
  );
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSaveRef = useRef<{ uuid: string; item: HttpRequest } | null>(null);

  useEffect(() => {
    setEditableItem(item);
    // Don't clear response anymore - it's preserved in Redux by UUID
  }, [item]);

  // Save changes to Redux with debouncing.
  const handleItemChange = useCallback((updatedItem: HttpRequest) => {
    setEditableItem(updatedItem);

    const itemUuid = (updatedItem as any).uuid || (item as any).uuid;
    if (itemUuid) pendingSaveRef.current = { uuid: itemUuid, item: { ...updatedItem, uuid: itemUuid } as any };

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      if (pendingSaveRef.current) {
        dispatch(updatePlaygroundItem(pendingSaveRef.current));
        pendingSaveRef.current = null;
      }
    }, 500);
  }, [dispatch, item]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (pendingSaveRef.current) {
        dispatch(updatePlaygroundItem(pendingSaveRef.current));
        pendingSaveRef.current = null;
      }
    };
  }, [dispatch]);

  const handleSendRequest = useCallback(async () => {
    setIsLoading(true);
    try {
      // Check both root level and config level for environments
      // TODO: Remove this
      const envs = (collection as any).environments || collection?.config?.environments || [];
      const environment = envs.find(
        (env: any) => env.name === selectedEnvironment
      );
      const result = await runner.runRequest({
        item: editableItem,
        collection,
        environment,
        runtimeVariables: {}
      });

      dispatch(setPlaygroundResponse({ uuid: itemUuid, response: result }));
    } catch (error) {
      dispatch(setPlaygroundResponse({ 
        uuid: itemUuid, 
        response: {
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      }));
    } finally {
      setIsLoading(false);
    }
  }, [collection, editableItem, runner, selectedEnvironment, itemUuid]);

  return (
    <ItemVariableResolverProvider collection={collection} ancestry={ancestry} item={editableItem as unknown as Item}>
    <div className="request-runner-container h-full flex flex-col px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <TitleLabel className="truncate mb-2 mt-3">{itemName}</TitleLabel>
      
      <QueryBar 
        item={editableItem}
        onSendRequest={handleSendRequest}
        isLoading={isLoading}
        onItemChange={handleItemChange}
      />
      
      <div
        ref={containerRef}
        className={`flex flex-1 overflow-hidden pt-4 ${orientation === 'vertical' ? 'flex-col' : 'flex-row'}`}
        style={{ userSelect: isResizing ? 'none' : undefined }}
      >
        <div
          className={orientation === 'vertical' ? 'shrink-0 overflow-hidden min-h-0' : 'shrink-0 overflow-hidden'}
          style={
            orientation === 'vertical'
              ? { height: `${paneSize}%` }
              : { width: `${paneSize}%`, borderColor: 'var(--border-color)' }
          }
        >
          <RequestPane item={editableItem} onItemChange={handleItemChange} />
        </div>

        <SplitDivider orientation={orientation} onPointerDown={startResize} active={isResizing} testId="playground-divider" />

        <div className="flex-1 overflow-hidden min-h-0">
          <ResponsePane response={response} isLoading={isLoading} />
        </div>
      </div>
    </div>
    </ItemVariableResolverProvider>
  );
};

const PlaygroundView: React.FC<PlaygroundViewProps> = ({ item, ...otherProps }) => {
  if (isUnsupportedRequest(item)) {
    return (
      <UnsupportedRequest
        className='px-4'
        item={item}
        titleVariant="label"
        showRequestDocs={false}
        emptyStateProps={{
          icon: <FileNotFoundIcon />,
          heading: 'Request type not supported',
          subheadingSuffix: "isn't currently supported in this playground."
        }}
      />
    );
  }
  return <HttpRequestPlaygroundView item={item} {...otherProps} />;
};

export default PlaygroundView;