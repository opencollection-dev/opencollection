import React, { useCallback } from 'react';
import type { OpenCollection } from '@opencollection/types';
import type { Item as OpenCollectionItem, Folder } from '@opencollection/types/collection/item';
import type { HttpRequest } from '@opencollection/types/requests/http';
import Method from '../../Docs/Method/Method';
import OpenCollectionLogo from '../../../assets/opencollection-logo.svg';
import { SidebarContainer, SidebarItems, SidebarItem } from './StyledWrapper';
import { getItemType, getItemName, getHttpMethod, isFolder as isFolderType, isHttpRequest } from '../../../utils/schemaHelpers';

export interface SidebarProps {
  collection: OpenCollection | null;
  selectedItemId: string | null;
  onSelectItem: (uuid: string) => void; // Now handles both requests and folders
  onToggleFolder: (uuid: string) => void; // Only for expanding/collapsing folders
  onEnvironmentsClick?: () => void;
  isEnvironmentsSelected?: boolean;
  onCollectionSettingsClick?: () => void;
  isCollectionSettingsSelected?: boolean;
  selectedEnvironment?: string;
  onEnvironmentChange?: (environment: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collection,
  selectedItemId,
  onSelectItem,
  onToggleFolder,
  onEnvironmentsClick,
  isEnvironmentsSelected = false,
  onCollectionSettingsClick,
  isCollectionSettingsSelected = false,
  selectedEnvironment = '',
  onEnvironmentChange
}) => {
  const renderFolderIcon = useCallback((isExpanded: boolean) => (
    <svg 
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="transform transition-transform duration-300"
      style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
    >
      <path 
        d="M9 6L15 12L9 18" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  ), []);

  const renderItem = useCallback((item: OpenCollectionItem, level = 0): React.ReactNode => {
    
    const isFolder = isFolderType(item);
    const itemType = getItemType(item);
    const itemName = getItemName(item);
    // Use UUID for active state comparison - now folders can also be active
    const isActive = !isEnvironmentsSelected && !isCollectionSettingsSelected && selectedItemId === (item as any).uuid;
    
    // Read isCollapsed from the item itself (defaults to true if not set)
    const isExpanded = isFolder ? !((item as any).isCollapsed ?? true) : false;
    
    const itemUuid = (item as any).uuid;
    
    const handleChevronClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isFolder) {
        onToggleFolder(itemUuid);
      }
    };
    
    const handleItemClick = () => {
      onSelectItem(itemUuid);
    };
    
    return (
      <div key={itemUuid} className="relative">
        <SidebarItem
          className={`
            flex items-center select-none text-sm cursor-pointer
            ${isActive ? 'active' : ''}
            ${isFolder ? 'folder' : ''}
            transition-all duration-200
          `}
          style={{ 
            paddingLeft: `${level * 16 + 8}px`
          }}
          onClick={handleItemClick}
        >
          
          {level > 0 && (
            <div 
              className="absolute inset-y-0" 
              style={{ 
                left: `${(level - 1) * 16 + 14}px`, 
                width: '1px', 
                backgroundColor: 'var(--border-color)'
              }}
            />
          )}
          
          {isFolder ? (
            <div 
              className="mr-2 shrink-0 p-1 rounded hover:bg-gray-100 transition-colors"
              onClick={handleChevronClick}
            >
              {renderFolderIcon(isExpanded)}
            </div>
          ) : (
            <Method 
              method={itemType === "http" ? getHttpMethod(item as HttpRequest) : 'GET'}
              className="text-xs"
            />
          )}
          
          
          <div className="truncate flex-1">
            {itemName}
          </div>
        </SidebarItem>
        
        
        {isFolder && isExpanded && (item as Folder).items && (
          <div className="relative">
            
            <div 
              className="absolute top-0 bottom-0 left-0" 
              style={{ 
                left: `${level * 16 + 14}px`, 
                width: '1px', 
                backgroundColor: 'var(--border-color)'
              }}
            />
            
            {((item as Folder).items || []).map((child: OpenCollectionItem) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  }, [isEnvironmentsSelected, isCollectionSettingsSelected, selectedItemId, onToggleFolder, onSelectItem, renderFolderIcon]);

  const envs = (collection as any).environments || collection?.config?.environments || [];

  return (
    <SidebarContainer className="h-full flex flex-col" style={{ width: 'var(--sidebar-width)' }}>
      {/* Collection name at top */}
      <div className="p-4 pb-0">
        <div className="flex items-center">
          <h1 className={`cursor-pointer font-semibold truncate flex-1 ${isCollectionSettingsSelected ? 'active' : ''}`} style={{ color: 'var(--text-primary)' }} onClick={onCollectionSettingsClick}>
            {collection?.info?.name || 'API Collection'}
          </h1>
        </div>
      </div>

      <div className="p-2 space-y-2">
          <div className="space-y-2">
            <div className="truncate flex-1 flex-row">
                {envs.length > 0 && onEnvironmentChange && (
                  <div className="px-2 w-full flex flex-row items-center justify-between">
                    <select
                      value={selectedEnvironment}
                      onChange={(e) => onEnvironmentChange(e.target.value)}
                      className="w-full text-xs font-medium cursor-pointer transition-all duration-200"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        padding: '6px 26px 6px 10px',
                        outline: 'none',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23777' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 8px center',
                        paddingRight: '26px'
                      }}
                    >
                      <option value="">No Environment</option>
                      {envs.map((env: any) => (
                        <option key={env.name} value={env.name}>
                          {env.name}
                        </option>
                      ))}
                    </select>
                    <svg 
                      width="14" 
                      height="14" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      style={{ marginLeft: '8px', flexShrink: 0 }}
                      className={`cursor-pointer ${isEnvironmentsSelected ? 'active' : ''}`}
                      onClick={onEnvironmentsClick}
                    >
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-3.5L19 4.5M5 19.5L2.5 17M19 19.5L16.5 17M5 4.5L2.5 7"></path>
                    </svg>
                  </div>
                  )}
              </div>
          </div>
      </div>
      
      <SidebarItems>
        {collection?.items?.length && (
          collection.items.map((item) => renderItem(item))
        )}
      </SidebarItems>
      
      {/* OpenCollection Logo */}
      <div className="p-2" style={{ borderColor: 'var(--border-color)' }}>
        <a 
          href="https://opencollection.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block opacity-50 hover:opacity-70 transition-opacity"
        >
          <img 
            src={OpenCollectionLogo} 
            alt="OpenCollection" 
            className="w-full max-w-[140px] mx-auto"
            style={{ 
              filter: 'grayscale(100%)'
            }}
          />
        </a>
      </div>
    </SidebarContainer>
  );
};

export default Sidebar;

