import React, { useEffect, useRef } from 'react';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import type { Item as OpenCollectionItem, Folder } from '@opencollection/types/collection/item';
import type { HttpRequest } from '@opencollection/types/requests/http';
import DrawerBackdrop from './DrawerBackdrop/DrawerBackdrop';
import DrawerDragBar from './DrawerDragBar/DrawerDragBar';
import DrawerContent from './DrawerContent/DrawerContent';
import { StyledDrawer } from './DrawerContent/Views/PlaygroundView/StyledWrapper';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectDrawerHeight,
  selectDrawerCollapsed,
  setDrawerHeight,
  setDrawerCollapsed,
  setViewMode,
  setSelectedItemId
} from '@slices/playground';

interface PlaygroundDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  collection: OpenCollectionCollection | null;
  selectedItem: HttpRequest | Folder | null;
  onSelectItem: (item: HttpRequest | Folder) => void;
}

const getMaxHeight = () => window.innerHeight;
const getDefaultHeight = () => window.innerHeight * 0.9;

const PlaygroundDrawer: React.FC<PlaygroundDrawerProps> = ({
  isOpen,
  onClose,
  collection,
  selectedItem,
  onSelectItem
}) => {
  const dispatch = useAppDispatch();
  const height = useAppSelector(selectDrawerHeight);
  const isCollapsed = useAppSelector(selectDrawerCollapsed);
  
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousSelectedItemRef = useRef<HttpRequest | Folder | null>(null);

  // Update selectedItemId when selectedItem changes
  useEffect(() => {
    if (!selectedItem) {
      dispatch(setSelectedItemId(null));
      return;
    }

    const itemWithUuid = selectedItem as any;
    if (itemWithUuid.uuid) {
      dispatch(setSelectedItemId(itemWithUuid.uuid));
    }
  }, [selectedItem, dispatch]);


  // Handle drawer open/close state
  useEffect(() => {
    if (isOpen) {
      // When opening, set to default height immediately
      dispatch(setDrawerCollapsed(false));
      const defaultHeight = getDefaultHeight();
      dispatch(setDrawerHeight(defaultHeight));
      dispatch(setViewMode('playground'));
    } else {
      // When closing, reset height to 0
      dispatch(setDrawerHeight(0));
      dispatch(setViewMode('playground'));
    }
  }, [isOpen, dispatch]);

  // Handle selected item changes - expand drawer if collapsed
  useEffect(() => {
    const itemChanged = previousSelectedItemRef.current !== selectedItem;
    previousSelectedItemRef.current = selectedItem;
    
    if (isOpen && isCollapsed && selectedItem && itemChanged) {
      dispatch(setDrawerCollapsed(false));
      const defaultHeight = getDefaultHeight();
      dispatch(setDrawerHeight(defaultHeight));
    }
  }, [selectedItem, isOpen, isCollapsed, dispatch]);

  // Update height when window resizes
  useEffect(() => {
    const handleResize = () => {
      dispatch(setDrawerHeight(Math.min(height, window.innerHeight)));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [height, dispatch]);

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <>
      <DrawerBackdrop isOpen={isOpen} isCollapsed={isCollapsed} onClose={onClose} />

      <StyledDrawer
        ref={drawerRef}
        style={{
          height: `${height}px`,
          maxHeight: `${getMaxHeight()}px`,
          boxShadow: isOpen ? '0 -4px 20px rgba(0, 0, 0, 0.15)' : '0 0 0 rgba(0, 0, 0, 0)'
        }}
      >
        <DrawerDragBar isCollapsed={isCollapsed} selectedItem={selectedItem} onClose={onClose} />

        {!isCollapsed && (
          <DrawerContent collection={collection} selectedItem={selectedItem} onSelectItem={onSelectItem} />
        )}
      </StyledDrawer>
    </>
  );
};

export default PlaygroundDrawer;

