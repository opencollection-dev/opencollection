import React, { useState } from 'react';
import type { Folder } from '@opencollection/types/collection/item';
import type { OpenCollection } from '@opencollection/types';
import Tabs from '../../../../../ui/Tabs/Tabs';
import { type KeyValueRow } from '../../../../../ui/KeyValueTable/KeyValueTable';
import { HeadersTab, VariablesTab, AuthTab, ScriptsTab } from '../Common';
import { useAppDispatch } from '../../../../../store/hooks';
import { updateFolderInCollection } from '@slices/playground';

interface FolderSettingsProps {
  folder: Folder;
  collection: OpenCollection;
  onFolderChange: (updatedFolder: Folder) => void;
}

const FolderSettings: React.FC<FolderSettingsProps> = ({
  folder,
  collection,
  onFolderChange
}) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('headers');

  const handleHeadersChange = (headers: KeyValueRow[]) => {
    const updatedHeaders = headers.map(h => ({
      name: h.name,
      value: h.value,
      disabled: !h.enabled
    }));
    
    const updatedFolder = {
      ...folder,
      request: {
        ...folder.request,
        headers: updatedHeaders
      }
    };
    
    const uuid = (folder as any).uuid;
    if (uuid) {
      dispatch(updateFolderInCollection({ uuid, folder: updatedFolder }));
    }
    onFolderChange(updatedFolder);
  };

  const handleVariablesChange = (variables: KeyValueRow[]) => {
    const updatedVariables = variables.map(v => ({
      name: v.name,
      value: v.value,
      disabled: !v.enabled
    }));
    
    const updatedFolder = {
      ...folder,
      request: {
        ...folder.request,
        variables: updatedVariables
      }
    };
    
    const uuid = (folder as any).uuid;
    if (uuid) {
      dispatch(updateFolderInCollection({ uuid, folder: updatedFolder }));
    }
    onFolderChange(updatedFolder);
  };

  const handleScriptChange = (scriptType: 'preRequest' | 'postResponse' | 'tests', value: string) => {
    const updatedFolder = {
      ...folder,
      request: {
        ...folder.request,
        scripts: {
          ...folder.request?.scripts,
          [scriptType]: value
        }
      }
    };
    
    const uuid = (folder as any).uuid;
    if (uuid) {
      dispatch(updateFolderInCollection({ uuid, folder: updatedFolder }));
    }
    onFolderChange(updatedFolder);
  };

  const handleAuthChange = (authType: string) => {
    let auth: any = 'inherit';
    
    if (authType !== 'none' && authType !== 'inherit') {
      auth = { type: authType };
    } else if (authType === 'none') {
      auth = undefined;
    }
    
    const updatedFolder = {
      ...folder,
      request: {
        ...folder.request,
        auth
      }
    };
    
    const uuid = (folder as any).uuid;
    if (uuid) {
      dispatch(updateFolderInCollection({ uuid, folder: updatedFolder }));
    }
    onFolderChange(updatedFolder);
  };

  const handleFolderAuthChange = (updatedFolder: Folder) => {
    const uuid = (updatedFolder as any).uuid;
    if (uuid) {
      dispatch(updateFolderInCollection({ uuid, folder: updatedFolder }));
    }
    onFolderChange(updatedFolder);
  };

  const renderHeaders = () => (
    <HeadersTab
      headers={folder.request?.headers || []}
      onHeadersChange={handleHeadersChange}
      title="Folder Headers"
      description="These headers will be inherited by all requests in this folder"
    />
  );

  const renderVariables = () => (
    <VariablesTab
      variables={folder.request?.variables || []}
      onVariablesChange={handleVariablesChange}
      title="Folder Variables"
      description="These variables will be available to all requests in this folder"
    />
  );

  const renderAuth = () => (
    <AuthTab
      auth={folder.request?.auth}
      onAuthChange={handleAuthChange}
      onItemChange={handleFolderAuthChange}
      item={folder}
      title="Folder Authentication"
      description="Authentication method for all requests in this folder"
      showInherit={true}
      showFullAuth={true}
    />
  );

  const renderScripts = () => (
    <ScriptsTab
      scripts={folder.request?.scripts || {}}
      onScriptChange={handleScriptChange}
      title="Folder Scripts"
      description="These scripts will run for all requests in this folder"
      showTests={true}
    />
  );

  const tabs = [
    { 
      id: 'headers', 
      label: 'Headers', 
      contentIndicator: folder.request?.headers?.length || undefined,
      content: renderHeaders() 
    },
    { 
      id: 'auth', 
      label: 'Auth', 
      content: renderAuth() 
    },
    { 
      id: 'variables', 
      label: 'Variables', 
      contentIndicator: folder.request?.variables?.length || undefined,
      content: renderVariables() 
    },
    { 
      id: 'scripts', 
      label: 'Scripts', 
      content: renderScripts() 
    }
  ];

  return (
    <div className="h-full flex flex-col px-4">
      <div className="border-b my-2 py-2" style={{ borderColor: 'var(--border-color)' }}>
        <h2 className="text-lg font-semibold leading-tight mb-2" style={{ color: 'var(--text-primary)' }}>
          {folder.name || 'Folder Settings'}
        </h2>
        <p className="text-sm mt-1 leading-tight" style={{ color: 'var(--text-secondary)' }}>
          Configure default settings for all requests in this folder
        </p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <Tabs
          tabs={tabs.map(tab => ({
            ...tab,
            content: <div className="py-3">{tab.content}</div>
          }))}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
};

export default FolderSettings;
