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
import { VariablesProvider } from '../../../../../ui/HighlightedInput';

interface PlaygroundProps {
  item: HttpRequest;
  collection: OpenCollectionCollection;
  selectedEnvironment?: string;
}

const Playground: React.FC<PlaygroundProps> = ({ item, collection, selectedEnvironment = '' }) => {
  const dispatch = useAppDispatch();
  const [editableItem, setEditableItem] = useState<HttpRequest>(item);
  const itemUuid = (item as any).uuid;
  const response = useAppSelector(state => selectPlaygroundResponse(state, itemUuid));
  const [isLoading, setIsLoading] = useState(false);
  const [requestPaneWidth, setRequestPaneWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
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
  }, [collection, editableItem, runner, selectedEnvironment]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const container = document.querySelector('.request-runner-container');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
    
    if (newWidth >= 20 && newWidth <= 80) {
      setRequestPaneWidth(newWidth);
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <VariablesProvider collection={collection} selectedEnvironment={selectedEnvironment}>
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
        
        <div className="flex flex-1 overflow-hidden pt-2">
          <div 
            className="shrink-0 overflow-hidden"
            style={{ 
              width: `${requestPaneWidth}%`,
              borderColor: 'var(--border-color)'
            }}
          >
            <RequestPane item={editableItem} onItemChange={handleItemChange} />
          </div>
          
          <div 
            className="cursor-col-resize shrink-0 relative hover:bg-opacity-10"
            style={{ 
              width: '1px',
              backgroundColor: 'var(--border-color)',
              margin: '0 16px',
              transition: 'background-color 0.2s'
            }}
            onMouseDown={handleMouseDown}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--border-color)';
            }}
          >
          </div>
          
          <div className="flex-1 overflow-hidden">
            <ResponsePane response={response} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </VariablesProvider>
  );
};

export default Playground; 