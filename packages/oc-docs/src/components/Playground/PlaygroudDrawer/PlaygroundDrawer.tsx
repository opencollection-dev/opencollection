import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import type { Item as OpenCollectionItem, Folder } from '@opencollection/types/collection/item';
import type { HttpRequest } from '@opencollection/types/requests/http';
import Playground from '../Playground';
import Sidebar from '../Sidebar/Sidebar';
import EnvironmentsView from '../EnvironmentsView/EnvironmentsView';
import { hydrateWithUUIDs, findAndUpdateItem } from '../../../utils/items';
import { StyledBackdrop, StyledDrawer, StyledDragBar } from './StyledWrapper';

type ViewMode = 'playground' | 'environments';

interface PlaygroundDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  collection: OpenCollectionCollection | null;
  selectedItem: HttpRequest | null;
  onSelectItem: (item: HttpRequest) => void;
  onCollectionUpdate?: (collection: OpenCollectionCollection) => void;
}

const COLLAPSED_HEIGHT = 41;
const COLLAPSE_THRESHOLD = () => window.innerHeight * 0.4;

const getMaxHeight = () => window.innerHeight;
const getDefaultHeight = () => window.innerHeight * 0.9;

const PlaygroundDrawer: React.FC<PlaygroundDrawerProps> = ({
  isOpen,
  onClose,
  collection,
  selectedItem,
  onSelectItem,
  onCollectionUpdate
}) => {
  const [height, setHeight] = useState(() => isOpen ? getDefaultHeight() : 0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hydratedCollection, setHydratedCollection] = useState<OpenCollectionCollection | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('playground');
  const drawerRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number>(0);
  const dragStartHeight = useRef<number>(0);
  const lastExpandedHeight = useRef<number>(getDefaultHeight());
  const previousSelectedItemRef = useRef<HttpRequest | null>(null);

  // Hydrate collection with UUIDs and preserve collapsed state
  useEffect(() => {
    if (!collection) {
      setHydratedCollection(null);
      return;
    }
    
    const hydrated = hydrateWithUUIDs(collection);
    
    const preserveCollapsedState = (
      newItems: OpenCollectionItem[],
      oldItems: OpenCollectionItem[]
    ): void => {
      for (const newItem of newItems) {
        const newUuid = (newItem as any).uuid;
        
        const oldItem = oldItems.find((old: any) => old.uuid === newUuid);
        
        if ('type' in newItem && newItem.type === 'folder') {
          if (oldItem && 'type' in oldItem && oldItem.type === 'folder') {
            (newItem as any).isCollapsed = (oldItem as any).isCollapsed;
            
            const newFolder = newItem as Folder;
            const oldFolder = oldItem as Folder;
            if (newFolder.items && oldFolder.items) {
              preserveCollapsedState(newFolder.items, oldFolder.items);
            }
          } else {
            if ((newItem as any).isCollapsed === undefined) {
              (newItem as any).isCollapsed = true;
            }
          }
        }
      }
    };
    
    const initializeCollapsedState = (items: OpenCollectionItem[] | undefined): void => {
      if (!items) return;
      
      for (const item of items) {
        if ('type' in item && item.type === 'folder') {
          // Initialize isCollapsed to true (collapsed) if not already set
          if ((item as any).isCollapsed === undefined) {
            (item as any).isCollapsed = true;
          }
          const folder = item as Folder;
          if (folder.items) {
            initializeCollapsedState(folder.items);
          }
        }
      }
    };
    
    // Preserve existing collapsed states from previous hydrated collection
    if (hydratedCollection?.items && hydrated.items) {
      preserveCollapsedState(hydrated.items, hydratedCollection.items);
    } else if (hydrated.items) {
      initializeCollapsedState(hydrated.items);
    }
    
    setHydratedCollection(hydrated);
  }, [collection]);

  // Update selectedItemId when selectedItem changes
  useEffect(() => {
    if (!selectedItem) {
      setSelectedItemId(null);
      return;
    }

    const itemWithUuid = selectedItem as any;
    if (itemWithUuid.uuid) {
      setSelectedItemId(itemWithUuid.uuid);
      return;
    }
    
    if (!hydratedCollection?.items) {
      setSelectedItemId(null);
      return;
    }
    
    const findItemUUID = (items: OpenCollectionItem[]): string | null => {
      for (const item of items) {
        const itemUuid = (item as any).uuid;
        // Compare by checking if this is the selected item
        if (itemUuid && 'type' in item && item.type === 'http') {
          const httpItem = item as HttpRequest;
          if (httpItem.name === selectedItem.name && 
              httpItem.method === selectedItem.method &&
              httpItem.url === selectedItem.url) {
            return itemUuid;
          }
        }
        
        if ('type' in item && item.type === 'folder') {
          const folder = item as Folder;
          if (folder.items) {
            const found = findItemUUID(folder.items);
            if (found) return found;
          }
        }
      }
      
      return null;
    };
    
    const uuid = findItemUUID(hydratedCollection.items);
    setSelectedItemId(uuid);
  }, [selectedItem, hydratedCollection]);

  const toggleFolder = useCallback((uuid: string) => {
    setHydratedCollection((prev) => {
      if (!prev?.items) return prev;
      
      const updated = { ...prev };
      findAndUpdateItem(updated.items, uuid, (item) => {
        const currentCollapsed = (item as any).isCollapsed ?? true;
        (item as any).isCollapsed = !currentCollapsed;
      });
      
      return updated;
    });
  }, []);

  const handleSelectItem = useCallback((uuid: string) => {
    if (!hydratedCollection?.items) return;
    
    setViewMode('playground');
    
    const findItem = (items: OpenCollectionItem[]): HttpRequest | null => {
      for (const item of items) {
        const itemUuid = (item as any).uuid;
        if (itemUuid === uuid && 'type' in item && item.type === 'http') {
          return item as HttpRequest;
        }
        
        if ('type' in item && item.type === 'folder') {
          const folder = item as Folder;
          if (folder.items) {
            const found = findItem(folder.items);
            if (found) return found;
          }
        }
      }
      
      return null;
    };
    
    const foundItem = findItem(hydratedCollection.items);
    
    if (foundItem) {
      onSelectItem(foundItem);
    }
  }, [hydratedCollection, onSelectItem]);


  useEffect(() => {
    if (isOpen) {
      // When opening, set to default height immediately
      setIsCollapsed(false);
      const defaultHeight = getDefaultHeight();
      setHeight(defaultHeight);
      lastExpandedHeight.current = defaultHeight;
      setViewMode('playground');
    } else {
      // When closing, reset height to 0
      setHeight(0);
      setViewMode('playground');
    }
  }, [isOpen]);

  useEffect(() => {
    const itemChanged = previousSelectedItemRef.current !== selectedItem;
    previousSelectedItemRef.current = selectedItem;
    
    if (isOpen && isCollapsed && selectedItem && itemChanged) {
      setIsCollapsed(false);
      const targetHeight = lastExpandedHeight.current > COLLAPSE_THRESHOLD() 
        ? lastExpandedHeight.current 
        : getDefaultHeight();
      setHeight(targetHeight);
    }
  }, [selectedItem, isOpen, isCollapsed]);

  const handleEnvironmentsClick = useCallback(() => {
    setViewMode('environments');
    setSelectedItemId(null);
  }, []);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartHeight.current = height;
    e.preventDefault();
  }, [height]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    // Calculate delta - dragging up (decreasing clientY) increases height
    const deltaY = dragStartY.current - e.clientY;
    const maxHeight = getMaxHeight();
    const collapseThreshold = COLLAPSE_THRESHOLD();
    const newHeight = Math.max(COLLAPSED_HEIGHT, Math.min(maxHeight, dragStartHeight.current + deltaY));
    
    setHeight(newHeight);
    
    if (newHeight <= collapseThreshold) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
      lastExpandedHeight.current = newHeight;
    }
  }, [isDragging]);

  // Update MAX_HEIGHT when window resizes
  useEffect(() => {
    const handleResize = () => {
      // MAX_HEIGHT is now window.innerHeight, which is already correct
      // But we need to ensure height doesn't exceed it
      setHeight((prev) => Math.min(prev, window.innerHeight));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (isCollapsed) {
      setHeight(COLLAPSED_HEIGHT);
    }
  }, [isCollapsed]);

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

  const handleToggleCollapse = useCallback(() => {
    if (isCollapsed) {
      setIsCollapsed(false);
      const targetHeight = lastExpandedHeight.current > COLLAPSE_THRESHOLD() 
        ? lastExpandedHeight.current 
        : getDefaultHeight();
      setHeight(targetHeight);
    } else {
      setIsCollapsed(true);
      const collapseThreshold = COLLAPSE_THRESHOLD();
      if (height > collapseThreshold) {
        lastExpandedHeight.current = height;
      }
      setHeight(COLLAPSED_HEIGHT);
    }
  }, [isCollapsed, height]);

  // Don't render if not open
  if (!isOpen) return null;

  const methodColors: Record<string, string> = {
    'GET': '#16a34a',
    'POST': '#2563eb',
    'PUT': '#f97316',
    'PATCH': '#8b5cf6',
    'DELETE': '#dc2626',
    'HEAD': '#6b7280',
    'OPTIONS': '#6b7280'
  };

  return (
    <>
      {/* Backdrop - only show when not collapsed */}
      <StyledBackdrop
        style={{
          opacity: (isOpen && !isCollapsed) ? 1 : 0,
          pointerEvents: (isOpen && !isCollapsed) ? 'auto' : 'none',
          backdropFilter: (isOpen && !isCollapsed) ? 'blur(2px)' : 'blur(0px)',
          WebkitBackdropFilter: (isOpen && !isCollapsed) ? 'blur(2px)' : 'blur(0px)'
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <StyledDrawer
        ref={drawerRef}
        style={{
          height: `${height}px`,
          maxHeight: `${getMaxHeight()}px`,
          boxShadow: isOpen ? '0 -4px 20px rgba(0, 0, 0, 0.15)' : '0 0 0 rgba(0, 0, 0, 0)'
        }}
      >
        {/* Drag Bar */}
        <StyledDragBar onMouseDown={handleDragStart}>
          <div
            style={{
              width: '40px',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: 'var(--border-color)',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--text-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--border-color)';
            }}
          />
          
          {isCollapsed && selectedItem && (
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: 'var(--text-primary)',
              fontWeight: 500
            }}>
              <span style={{
                color: (selectedItem.method && methodColors[selectedItem.method]) || '#6b7280',
                fontWeight: 600,
                fontSize: '11px'
              }}>
                {selectedItem.method}
              </span>
              <span>{selectedItem.name || ''}</span>
            </div>
          )}
          
          <div style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button
              onClick={handleToggleCollapse}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {isCollapsed ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                  Expand
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  Collapse
                </>
              )}
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              Close
            </button>
          </div>
        </StyledDragBar>

        {/* Drawer Content */}
        {!isCollapsed && (
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
            {/* Sidebar */}
            <div
              style={{
                width: 'var(--sidebar-width)',
                minWidth: 'var(--sidebar-width)',
                borderRight: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                flexShrink: 0,
                overflow: 'hidden'
              }}
            >
                  <Sidebar
                    collection={hydratedCollection}
                    selectedItemId={selectedItemId}
                    onSelectItem={handleSelectItem}
                    onToggleFolder={toggleFolder}
                    onEnvironmentsClick={handleEnvironmentsClick}
                    isEnvironmentsSelected={viewMode === 'environments'}
                  />
            </div>

            {/* Main Playground Content */}
            <div style={{ 
              flex: 1, 
              overflow: 'hidden', 
              display: 'flex', 
              flexDirection: 'column', 
              backgroundColor: '#ffffff',
              minHeight: 0
            }}>
              {viewMode === 'playground' ? (
                selectedItem && collection ? (
                  <Playground
                    item={selectedItem}
                    collection={collection}
                  />
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#6c757d',
                    backgroundColor: '#ffffff'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <p>Select an endpoint from the sidebar to get started</p>
                    </div>
                  </div>
                )
              ) : (
                <EnvironmentsView
                  collection={collection}
                  onCollectionUpdate={onCollectionUpdate}
                />
              )}
            </div>
          </div>
        )}
      </StyledDrawer>
    </>
  );
};

export default PlaygroundDrawer;

