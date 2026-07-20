import React, { useState } from 'react';
import type { Folder } from '@opencollection/types/collection/item';
import type { OpenCollection } from '@opencollection/types';
import Tabs from '../../../../../ui/Tabs/Tabs';
import { type KeyValueRow } from '../../../../../components/KeyValueTable/KeyValueTable';
import { rowToVariable } from '../../../../../utils/variableDataType';
import HeadersTab from '../Common/HeadersTab/HeadersTab';
import VariablesTab from '../Common/VariablesTab/VariablesTab';
import AuthTab from '../Common/AuthTab/AuthTab';
import ScriptsTab from '../Common/ScriptsTab/ScriptsTab';
import { useAppDispatch } from '../../../../../store/hooks';
import { updateFolderInCollection } from '@slices/playground';
import {
  countEnabled,
  getItemDocs,
  getItemName,
  scriptsArrayToObject,
  scriptsObjectToArray
} from '../../../../../utils/schemaHelpers';
import TestsTab from '../Common/TestsTab/TestsTab';
import OverviewTab from '../Common/OverviewTab/OverviewTab';

interface FolderSettingsProps {
  folder: Folder;
  collection: OpenCollection;
  onFolderChange: (updatedFolder: Folder) => void;
}

const FolderSettings: React.FC<FolderSettingsProps> = ({ folder, onFolderChange }) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('overview');

  const handleHeadersChange = (headers: KeyValueRow[]) => {
    const originals = folder.request?.headers ?? [];
    const originalByName = new Map(
      originals.filter((header) => header.name).map((header): [string, typeof header] => [header.name as string, header])
    );
    const updatedHeaders = headers.map((h) => {
      const description = 'description' in h ? h.description : originalByName.get(h.name)?.description;
      return {
        name: h.name,
        value: h.value,
        disabled: !h.enabled,
        ...(description !== undefined ? { description } : {})
      };
    });

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
    const updatedFolder = {
      ...folder,
      request: {
        ...folder.request,
        variables: variables.map(rowToVariable)
      }
    };

    const uuid = (folder as any).uuid;
    if (uuid) {
      dispatch(updateFolderInCollection({ uuid, folder: updatedFolder }));
    }
    onFolderChange(updatedFolder);
  };

  const handleScriptChange = (scriptType: 'preRequest' | 'postResponse' | 'tests', value: string) => {
    const currentScriptsObj = scriptsArrayToObject(folder.request?.scripts);
    const updatedScriptsObj = { ...currentScriptsObj, [scriptType]: value };

    const updatedFolder = {
      ...folder,
      request: {
        ...folder.request,
        scripts: scriptsObjectToArray(updatedScriptsObj)
      }
    } as Folder;

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

  const renderOverview = () => (
    <OverviewTab 
      docs={getItemDocs(folder)} 
      emptyStateSubheading="This folder has no docs. Add one in Bruno to introduce your API to readers: what it does, who it's for, and how to authenticate." 
    />
  );

  const renderHeaders = () => (
    <HeadersTab
      headers={folder.request?.headers || []}
      onHeadersChange={handleHeadersChange}
      title=""
      description="Request headers that will be sent with every request inside this folder."
    />
  );

  const renderVariables = () => (
    <VariablesTab
      variables={folder.request?.variables || []}
      onVariablesChange={handleVariablesChange}
      title=""
      description="Variables available to every request inside this folder."
    />
  );

  const renderAuth = () => (
    <AuthTab
      auth={folder.request?.auth}
      onAuthChange={handleAuthChange}
      onItemChange={handleFolderAuthChange}
      item={folder}
      title=""
      description="Configures authentication for this folder. This applies to all requests using the Inherit option in the Auth tab."
      showInherit={true}
      showFullAuth={true}
    />
  );

  const scripts = scriptsArrayToObject(folder.request?.scripts);

  const renderScripts = () => (
    <ScriptsTab
      scripts={scripts}
      onScriptChange={handleScriptChange}
      title=""
      description="Pre and post-request scripts that will run before and after any request inside this folder is sent."
      showTests={false}
    />
  );

  const renderTests = () => (
    <TestsTab
      scripts={scripts}
      onScriptChange={handleScriptChange}
      title=""
      description="These tests will run any time a request in this folder is sent."
    />
  );

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: renderOverview()
    },
    {
      id: 'headers',
      label: 'Headers',
      contentIndicator: countEnabled(folder.request?.headers),
      content: renderHeaders()
    },
    {
      id: 'scripts',
      label: 'Scripts',
      content: renderScripts()
    },
    {
      id: 'tests',
      label: 'Tests',
      content: renderTests()
    },
    {
      id: 'variables',
      label: 'Vars',
      contentIndicator: countEnabled(folder.request?.variables),
      content: renderVariables()
    },
    {
      id: 'auth',
      label: 'Auth',
      content: renderAuth()
    }
  ];

  return (
    <div className="h-full flex flex-col px-5 mt-5">
      <div style={{ borderColor: 'var(--border-color)' }}>
        <h2 className="text-lg font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
          {getItemName(folder) || 'Folder Settings'}
        </h2>
      </div>

      <div className="flex-1 overflow-hidden mt-4">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default FolderSettings;
