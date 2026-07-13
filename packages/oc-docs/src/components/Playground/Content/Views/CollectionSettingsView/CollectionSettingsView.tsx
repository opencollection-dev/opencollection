import React, { useState } from 'react';
import type { OpenCollection } from '@opencollection/types';
import type { VariableValue, VariableValueOrVariants } from '@opencollection/types/common/variables';
import Tabs from '../../../../../ui/Tabs/Tabs';
import { type KeyValueRow } from '../../../../../ui/KeyValueTable/KeyValueTable';
import HeadersTab from '../Common/HeadersTab/HeadersTab';
import VariablesTab from '../Common/VariablesTab/VariablesTab';
import AuthTab from '../Common/AuthTab';
import ScriptsTab from '../Common/ScriptsTab/ScriptsTab';
import TestsTab from '../Common/TestsTab/TestsTab';
import OverviewTab from '../Common/OverviewTab/OverviewTab';
import { useAppDispatch } from '../../../../../store/hooks';
import { updateCollectionSettings } from '@slices/playground';
import { countEnabled, getItemDocs, scriptsArrayToObject, scriptsObjectToArray } from '../../../../../utils/schemaHelpers';
import { unwrapVariableValue } from '../../../../../utils/variableResolution';

interface CollectionSettingsProps {
  collection: OpenCollection;
}

const retypeValue = (previous: VariableValue | undefined, next: string): VariableValue =>
  previous && typeof previous === 'object' && 'data' in previous ? { ...previous, data: next } : next;

const rewriteVariableValue = (original: VariableValueOrVariants | undefined, next: string): VariableValueOrVariants => {
  if (Array.isArray(original)) {
    const active = original.find((variant) => variant.selected) ?? original[0];
    return original.map((variant) => (variant === active ? { ...variant, value: retypeValue(variant.value, next) } : variant));
  }
  return retypeValue(original, next);
};

const CollectionSettings: React.FC<CollectionSettingsProps> = ({ collection }) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('overview');

  const updateRequest = (request: NonNullable<OpenCollection['request']>) => {
    dispatch(updateCollectionSettings({ ...collection, request }));
  };

  const handleHeadersChange = (rows: KeyValueRow[]) => {
    const originals = collection.request?.headers ?? [];
    const originalByName = new Map(originals.filter((header) => header.name).map((header): [string, typeof header] => [header.name as string, header]));
    updateRequest({
      ...collection.request,
      headers: rows.map((row) => ({
        ...(originalByName.get(row.name) ?? {}),
        name: row.name,
        value: row.value,
        disabled: !row.enabled
      }))
    });
  };

  const handleVariablesChange = (rows: KeyValueRow[]) => {
    const originals = collection.request?.variables ?? [];
    const originalByName = new Map(originals.filter((variable) => variable.name).map((variable): [string, typeof variable] => [variable.name as string, variable]));
    updateRequest({
      ...collection.request,
      variables: rows.map((row) => {
        const original = originalByName.get(row.name);
        if (!original) return { name: row.name, value: row.value, disabled: !row.enabled };
        const originalValue = 'value' in original ? original.value : undefined;
        const value = unwrapVariableValue(originalValue) === row.value ? originalValue : rewriteVariableValue(originalValue, row.value);
        return { ...original, name: row.name, value, disabled: !row.enabled };
      })
    });
  };

  const handleScriptChange = (scriptType: 'preRequest' | 'postResponse' | 'tests', value: string) => {
    const updatedScripts = { ...scriptsArrayToObject(collection.request?.scripts), [scriptType]: value };
    updateRequest({ ...collection.request, scripts: scriptsObjectToArray(updatedScripts) });
  };

  const handleAuthChange = (authType: string) => {
    const auth = authType === 'none' ? undefined : authType === 'inherit' ? 'inherit' : { type: authType };
    updateRequest({ ...collection.request, auth: auth as NonNullable<OpenCollection['request']>['auth'] });
  };

  const handleCollectionChange = (updatedCollection: OpenCollection) => {
    dispatch(updateCollectionSettings(updatedCollection));
  };

  const headers = collection.request?.headers ?? [];
  const variables = collection.request?.variables ?? [];
  const scripts = scriptsArrayToObject(collection.request?.scripts);
  const version = collection.info?.version;

  const scriptCount = [scripts.preRequest, scripts.postResponse].filter((s) => Boolean(s && s.trim())).length || undefined;

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: <OverviewTab docs={getItemDocs(collection)} />
    },
    {
      id: 'headers',
      label: 'Headers',
      contentIndicator: countEnabled(headers),
      content: (
        <HeadersTab
          headers={headers}
          onHeadersChange={handleHeadersChange}
          title=""
          description="Request headers sent with every request in this collection."
        />
      )
    },
    {
      id: 'variables',
      label: 'Vars',
      contentIndicator: countEnabled(variables),
      content: (
        <VariablesTab
          variables={variables}
          onVariablesChange={handleVariablesChange}
          title=""
          description="Variables available to every request in this collection."
        />
      )
    },
    {
      id: 'auth',
      label: 'Auth',
      content: (
        <AuthTab
          auth={collection.request?.auth}
          onAuthChange={handleAuthChange}
          onItemChange={handleCollectionChange}
          item={collection}
          title=""
          description="Default authentication for this collection. Applies to any request using the Inherit option in its Auth tab."
          showInherit={false}
          showFullAuth={true}
        />
      )
    },
    {
      id: 'scripts',
      label: 'Scripts',
      contentIndicator: scriptCount,
      content: (
        <ScriptsTab
          scripts={scripts}
          onScriptChange={handleScriptChange}
          title=""
          description="Pre and post-request scripts that run before and after every request in this collection is sent."
          showTests={false}
        />
      )
    },
    {
      id: 'tests',
      label: 'Tests',
      content: (
        <TestsTab
          scripts={scripts}
          onScriptChange={handleScriptChange}
          title=""
          description="These tests run any time a request in this collection is sent."
        />
      )
    }
  ];

  return (
    <div className="h-full flex flex-col px-5 mt-5">
      <div className="flex items-baseline gap-2">
        <h2 className="text-lg font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
          {collection.info?.name || 'Collection Settings'}
        </h2>
        {version && (
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Version {version}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-hidden mt-4">
        <Tabs
          tabs={tabs.map((tab) => ({
            ...tab,
            content: <div className="py-3">{tab.content}</div>
          }))}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          testId="collection-settings-tabs"
        />
      </div>
    </div>
  );
};

export default CollectionSettings;
