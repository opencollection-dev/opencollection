import React, { useState } from 'react';
import type { OpenCollection } from '@opencollection/types';
import Tabs from '../../../../../ui/Tabs/Tabs';
import { type EditableTableRow } from '../../../../../ui/EditableTable';
import { HeadersTab, VariablesTab, AuthTab, ScriptsTab } from '../Common';
import { useAppDispatch } from '../../../../../store/hooks';
import { updateCollectionSettings } from '@slices/playground';
import { scriptsArrayToObject, scriptsObjectToArray } from '../../../../../utils/schemaHelpers';

interface CollectionSettingsProps {
  collection: OpenCollection;
}

const CollectionSettings: React.FC<CollectionSettingsProps> = ({ collection }) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('headers');

  const handleHeadersChange = (headers: EditableTableRow[]) => {
    const updatedHeaders = headers.map(h => ({
      uid: h.uid,
      name: h.name,
      value: h.value,
      disabled: !h.enabled
    }));

    const updatedCollection = {
      ...collection,
      request: {
        ...collection.request,
        headers: updatedHeaders
      }
    };
    dispatch(updateCollectionSettings(updatedCollection));
  };

  const handleVariablesChange = (variables: EditableTableRow[]) => {
    const updatedVariables = variables.map(v => ({
      uid: v.uid,
      name: v.name,
      value: v.value,
      disabled: !v.enabled
    }));

    const updatedCollection = {
      ...collection,
      request: {
        ...collection.request,
        variables: updatedVariables
      }
    };
    dispatch(updateCollectionSettings(updatedCollection));
  };

  const handleScriptChange = (scriptType: 'preRequest' | 'postResponse' | 'tests', value: string) => {
    const currentScriptsObj = scriptsArrayToObject(collection.request?.scripts);
    const updatedScriptsObj = { ...currentScriptsObj, [scriptType]: value };
    
    const updatedCollection = {
      ...collection,
      request: {
        ...collection.request,
        scripts: scriptsObjectToArray(updatedScriptsObj)
      }
    } as OpenCollection;
    dispatch(updateCollectionSettings(updatedCollection));
  };

  const handleAuthChange = (authType: string) => {
    let auth: any = 'inherit';
    
    if (authType !== 'none' && authType !== 'inherit') {
      auth = { type: authType };
    } else if (authType === 'none') {
      auth = undefined;
    }
    
    const updatedCollection = {
      ...collection,
      request: {
        ...collection.request,
        auth
      }
    };
    dispatch(updateCollectionSettings(updatedCollection));
  };

  const handleCollectionChange = (updatedCollection: OpenCollection) => {
    dispatch(updateCollectionSettings(updatedCollection));
  };

  const handleInfoChange = (field: 'name' | 'summary' | 'version', value: string) => {
    const updatedCollection = {
      ...collection,
      info: {
        ...collection.info,
        [field]: value
      }
    };
    dispatch(updateCollectionSettings(updatedCollection));
  };

  const renderInfo = () => {
    const info = collection.info || {};

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Collection Information
          </span>
          <span className="text-xs leading-tight" style={{ color: 'var(--text-secondary)' }}>
            Basic metadata about your collection
          </span>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Name
            </label>
            <input
              type="text"
              value={info.name || ''}
              onChange={(e) => handleInfoChange('name', e.target.value)}
              placeholder="Collection name"
              className="w-full px-2.5 py-1.5 text-sm border rounded"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Summary
            </label>
            <textarea
              value={info.summary || ''}
              onChange={(e) => handleInfoChange('summary', e.target.value)}
              placeholder="Brief description of your collection"
              rows={2}
              className="w-full px-2.5 py-1.5 text-sm border rounded resize-none"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Version
            </label>
            <input
              type="text"
              value={info.version || ''}
              onChange={(e) => handleInfoChange('version', e.target.value)}
              placeholder="1.0.0"
              className="w-full px-2.5 py-1.5 text-sm border rounded"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderHeaders = () => (
    <HeadersTab
      headers={collection.request?.headers || []}
      onHeadersChange={handleHeadersChange}
      title="Collection Headers"
      description="These headers will be inherited by all requests in this collection"
    />
  );

  const renderVariables = () => (
    <VariablesTab
      variables={collection.request?.variables || []}
      onVariablesChange={handleVariablesChange}
      title="Collection Variables"
      description="These variables will be available to all requests in this collection"
    />
  );

  const renderAuth = () => (
    <AuthTab
      auth={collection.request?.auth}
      onAuthChange={handleAuthChange}
      onItemChange={handleCollectionChange}
      item={collection}
      title="Collection Authentication"
      description="Default authentication method for all requests in this collection"
      showInherit={true}
      showFullAuth={true}
    />
  );

  const renderScripts = () => (
    <ScriptsTab
      scripts={scriptsArrayToObject(collection.request?.scripts)}
      onScriptChange={handleScriptChange}
      title="Collection Scripts"
      description="These scripts will run for all requests in this collection"
      showTests={true}
    />
  );

  const tabs = [
    { 
      id: 'info', 
      label: 'Info', 
      content: renderInfo() 
    },
    { 
      id: 'headers', 
      label: 'Headers', 
      contentIndicator: collection.request?.headers?.length || undefined,
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
      contentIndicator: collection.request?.variables?.length || undefined,
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
          {collection.info?.name || 'Collection Settings'}
        </h2>
        <p className="text-sm mt-1 leading-tight" style={{ color: 'var(--text-secondary)' }}>
          Configure default settings for all requests in this collection
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

export default CollectionSettings;
