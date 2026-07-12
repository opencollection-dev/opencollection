import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import { requestRunner } from '../../../../../runner';
import RequestHeader from './RequestPane/RequestHeader/RequestHeader';
import QueryBar from './QueryBar/QueryBar';
import RequestPane from './RequestPane/RequestPane';
import ResponsePane from './ResponsePane/ResponsePane';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { updatePlaygroundItem, setPlaygroundResponse, selectPlaygroundResponse } from '../../../../../store/slices/playground';
import { useSplitPane } from '../../../../../hooks/useSplitPane';
import { SplitDivider } from '../../../../SplitDivider/SplitDivider';

interface PlaygroundProps {
  item: HttpRequest;
  collection: OpenCollectionCollection;
  selectedEnvironment?: string;
  orientation?: 'horizontal' | 'vertical';
}

const Playground: React.FC<PlaygroundProps> = ({ item, collection, selectedEnvironment = '', orientation = 'horizontal' }) => {
  const dispatch = useAppDispatch();
  const [editableItem, setEditableItem] = useState<HttpRequest>(item);
  const itemUuid = (item as any).uuid;
  const response = useAppSelector(state => selectPlaygroundResponse(state, itemUuid));
  const [isLoading, setIsLoading] = useState(false);
  // The request/response split is one draggable divider whose axis follows the
  // orientation: horizontal layout resizes width, vertical layout resizes height.
  const { size: paneSize, isResizing, containerRef, startResize } = useSplitPane(orientation);
  const runner = useMemo(() => requestRunner, []);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setEditableItem(item);
    // Don't clear response anymore - it's preserved in Redux by UUID
  }, [item]);

  // Save changes to Redux with debouncing
  const handleItemChange = useCallback((updatedItem: HttpRequest) => {
    setEditableItem(updatedItem);
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      const itemUuid = (updatedItem as any).uuid || (item as any).uuid;
      if (itemUuid) {
        const itemWithUuid = { ...updatedItem, uuid: itemUuid } as any;
        dispatch(updatePlaygroundItem({ uuid: itemUuid, item: itemWithUuid }));
      }
    }, 500);
  }, [dispatch, item]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

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
    <div className="request-runner-container h-full flex flex-col px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <RequestHeader 
        item={editableItem} 
        collection={collection}
        selectedEnvironment={selectedEnvironment}
        onEnvironmentChange={() => {}} // Environment is now managed by parent
        readOnlyEnvironment={true}
      />
      
      <QueryBar 
        item={editableItem}
        onSendRequest={handleSendRequest}
        isLoading={isLoading}
        onItemChange={handleItemChange}
      />
      
      <div
        ref={containerRef}
        className={`flex flex-1 overflow-hidden pt-2 ${orientation === 'vertical' ? 'flex-col' : 'flex-row'}`}
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

        <SplitDivider orientation={orientation} onPointerDown={startResize} testId="playground-divider" />

        <div className="flex-1 overflow-hidden min-h-0">
          <ResponsePane response={response} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Playground; 