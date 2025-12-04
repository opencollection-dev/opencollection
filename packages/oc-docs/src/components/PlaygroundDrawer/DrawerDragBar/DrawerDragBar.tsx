import React, { useCallback, useEffect, useRef } from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Folder } from '@opencollection/types/collection/item';
import { StyledDragBar } from '../DrawerContent/Views/PlaygroundView/StyledWrapper';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  selectDrawerHeight,
  selectDrawerCollapsed,
  selectDrawerDragging,
  selectLastExpandedHeight,
  setDrawerHeight,
  setDrawerCollapsed,
  setDrawerDragging,
  setLastExpandedHeight
} from '@slices/playground';

interface DrawerDragBarProps {
  isCollapsed: boolean;
  selectedItem: HttpRequest | Folder | null;
  onClose: () => void;
}

const COLLAPSED_HEIGHT = 41;
const COLLAPSE_THRESHOLD = () => window.innerHeight * 0.4;
const getMaxHeight = () => window.innerHeight;
const getDefaultHeight = () => window.innerHeight * 0.9;

const methodColors: Record<string, string> = {
  'GET': '#16a34a',
  'POST': '#2563eb',
  'PUT': '#f97316',
  'PATCH': '#8b5cf6',
  'DELETE': '#dc2626',
  'HEAD': '#6b7280',
  'OPTIONS': '#6b7280'
};

const DrawerDragBar: React.FC<DrawerDragBarProps> = ({ isCollapsed, selectedItem, onClose }) => {
  const dispatch = useAppDispatch();
  const height = useAppSelector(selectDrawerHeight);
  const isDragging = useAppSelector(selectDrawerDragging);
  const lastExpandedHeight = useAppSelector(selectLastExpandedHeight);
  
  const dragStartY = useRef<number>(0);
  const dragStartHeight = useRef<number>(0);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    dispatch(setDrawerDragging(true));
    dragStartY.current = e.clientY;
    dragStartHeight.current = height;
    e.preventDefault();
  }, [height, dispatch]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    // Calculate delta - dragging up (decreasing clientY) increases height
    const deltaY = dragStartY.current - e.clientY;
    const maxHeight = getMaxHeight();
    const collapseThreshold = COLLAPSE_THRESHOLD();
    const newHeight = Math.max(COLLAPSED_HEIGHT, Math.min(maxHeight, dragStartHeight.current + deltaY));
    
    dispatch(setDrawerHeight(newHeight));
    
    if (newHeight <= collapseThreshold) {
      dispatch(setDrawerCollapsed(true));
    } else {
      dispatch(setDrawerCollapsed(false));
      dispatch(setLastExpandedHeight(newHeight));
    }
  }, [isDragging, dispatch]);

  const handleMouseUp = useCallback(() => {
    dispatch(setDrawerDragging(false));
    if (isCollapsed) {
      dispatch(setDrawerHeight(COLLAPSED_HEIGHT));
    }
  }, [isCollapsed, dispatch]);

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
      dispatch(setDrawerCollapsed(false));
      const targetHeight = lastExpandedHeight > COLLAPSE_THRESHOLD() 
        ? lastExpandedHeight 
        : getDefaultHeight();
      dispatch(setDrawerHeight(targetHeight));
    } else {
      dispatch(setDrawerCollapsed(true));
      const collapseThreshold = COLLAPSE_THRESHOLD();
      if (height > collapseThreshold) {
        dispatch(setLastExpandedHeight(height));
      }
      dispatch(setDrawerHeight(COLLAPSED_HEIGHT));
    }
  }, [isCollapsed, height, lastExpandedHeight, dispatch]);

  return (
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
            color: (selectedItem.type === 'http' && (selectedItem as HttpRequest).method && methodColors[(selectedItem as HttpRequest).method!]) || '#6b7280',
            fontWeight: 600,
            fontSize: '11px'
          }}>
            {selectedItem.type === 'http' ? (selectedItem as HttpRequest).method : selectedItem.type === 'folder' ? 'FOLDER' : ''}
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
  );
};

export default DrawerDragBar;

