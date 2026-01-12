import React, { useCallback, useEffect, useMemo } from 'react';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import type { Item as OpenCollectionItem, Folder } from '@opencollection/types/collection/item';
import type { HttpRequest } from '@opencollection/types/requests/http';
import Sidebar from '../Sidebar/Sidebar';
import Playground from './Views/PlaygroundView/PlaygroundView';
import EnvironmentsView from './Views/EnvironmentsView/EnvironmentsView';
import FolderSettingsView from './Views/FolderSettingsView/FolderSettingsView';
import CollectionSettingsView from './Views/CollectionSettingsView/CollectionSettingsView';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  selectHydratedCollection,
  selectViewMode,
  selectSelectedItemId,
  selectSelectedEnvironment,
  setViewMode,
  setSelectedItemId,
  setSelectedEnvironment,
  toggleFolderCollapse
} from '@slices/playground';
import { getItemType, isFolder, isHttpRequest } from '../../../utils/schemaHelpers';

interface DrawerContentProps {
  collection: OpenCollectionCollection | null;
  selectedItem: HttpRequest | Folder | null;
  onSelectItem: (item: HttpRequest | Folder) => void;
}

const DrawerContent: React.FC<DrawerContentProps> = ({ collection, selectedItem, onSelectItem }) => {
  const dispatch = useAppDispatch();
  const hydratedCollection = useAppSelector(selectHydratedCollection);
  const viewMode = useAppSelector(selectViewMode);
  const selectedItemId = useAppSelector(selectSelectedItemId);
  const selectedEnvironment = useAppSelector(selectSelectedEnvironment);

  const environments = useMemo(() => {
    if (!collection) return [];
    return (collection as any).environments || collection?.config?.environments || [];
  }, [collection]);

  useEffect(() => {
    if (!selectedEnvironment && environments.length > 0) {
      dispatch(setSelectedEnvironment(environments[0].name));
    }
  }, [selectedEnvironment, environments, dispatch]);

  const handleToggleFolder = useCallback((uuid: string) => {
    dispatch(toggleFolderCollapse(uuid));
  }, [dispatch]);

  const handleSelectItem = useCallback((uuid: string) => {
    if (!hydratedCollection?.items) return;
    
    const findItem = (items: OpenCollectionItem[]): HttpRequest | Folder | null => {
      for (const item of items) {
        const itemUuid = (item as any).uuid;
        const itemType = getItemType(item);
        
        if (itemUuid === uuid) {
          if (itemType === 'http' || itemType === 'folder') {
            return item as HttpRequest | Folder;
          }
        }
        
        if (isFolder(item)) {
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
      // Set view mode based on item type
      const foundItemType = getItemType(foundItem);
      if (foundItemType === 'folder') {
        dispatch(setViewMode('folder-settings'));
      } else {
        dispatch(setViewMode('playground'));
      }
      
      onSelectItem(foundItem);
    }
  }, [hydratedCollection, onSelectItem, dispatch]);

  const handleEnvironmentsClick = useCallback(() => {
    dispatch(setViewMode('environments'));
    dispatch(setSelectedItemId(null));
  }, [dispatch]);

  const handleCollectionSettingsClick = useCallback(() => {
    dispatch(setViewMode('collection-settings'));
    dispatch(setSelectedItemId(null));
  }, [dispatch]);

  const handleEnvironmentChange = useCallback((env: string) => {
    dispatch(setSelectedEnvironment(env));
  }, [dispatch]);

  return (
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
          onToggleFolder={handleToggleFolder}
          onEnvironmentsClick={handleEnvironmentsClick}
          isEnvironmentsSelected={viewMode === 'environments'}
          onCollectionSettingsClick={handleCollectionSettingsClick}
          isCollectionSettingsSelected={viewMode === 'collection-settings'}
          selectedEnvironment={selectedEnvironment}
          onEnvironmentChange={handleEnvironmentChange}
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
          selectedItem && getItemType(selectedItem) === 'http' && collection ? (
            <Playground
              item={selectedItem as HttpRequest}
              collection={collection}
              selectedEnvironment={selectedEnvironment}
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
        ) : viewMode === 'folder-settings' ? (
          selectedItem && getItemType(selectedItem) === 'folder' && collection ? (
            <FolderSettingsView
              folder={selectedItem as Folder}
              collection={collection}
              onFolderChange={onSelectItem}
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
                <p>Select a folder from the sidebar to configure its settings</p>
              </div>
            </div>
          )
        ) : viewMode === 'collection-settings' ? (
          collection ? (
            <CollectionSettingsView collection={collection} />
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
                <p>No collection available for settings</p>
              </div>
            </div>
          )
        ) : (
          <EnvironmentsView collection={collection} />
        )}
      </div>
    </div>
  );
};

export default DrawerContent;

