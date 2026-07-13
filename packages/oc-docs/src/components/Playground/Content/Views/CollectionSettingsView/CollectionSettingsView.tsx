import React, { useState } from 'react';
import type { OpenCollection } from '@opencollection/types';
import type { StructuredText } from '@opencollection/types/common/description';
import Tabs from '../../../../../ui/Tabs/Tabs';
import { type KeyValueRow } from '../../../../../ui/KeyValueTable/KeyValueTable';
import HeadersTab from '../Common/HeadersTab/HeadersTab';
import VariablesTab from '../Common/VariablesTab/VariablesTab';
import AuthTab from '../Common/AuthTab';
import ScriptsTab from '../Common/ScriptsTab/ScriptsTab';
import TestsTab from '../Common/TestsTab/TestsTab';
import OverviewTab from '../Common/OverviewTab/OverviewTab';
import { EmptyState } from '../../../../../ui/EmptyState/EmptyState';
import { BookIcon } from '../../../../../assets/icons';
import { useAppDispatch } from '../../../../../store/hooks';
import { updateCollectionSettings } from '@slices/playground';
import { scriptsArrayToObject, scriptsObjectToArray } from '../../../../../utils/schemaHelpers';
import { unwrapVariableValue } from '../../../../../utils/variableResolution';

interface CollectionSettingsProps {
  collection: OpenCollection;
}

const getCollectionDocs = (docs: OpenCollection['docs']): string | undefined => {
  if (!docs) return undefined;
  return typeof docs === 'string' ? docs : (docs as StructuredText).content;
};

const CollectionSettings: React.FC<CollectionSettingsProps> = ({ collection }) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('overview');

  const updateRequest = (request: NonNullable<OpenCollection['request']>) => {
    dispatch(updateCollectionSettings({ ...collection, request }));
  };

  const handleHeadersChange = (rows: KeyValueRow[]) => {
    const originals = collection.request?.headers ?? [];
    const originalById = new Map(originals.map((header, index): [string, typeof header] => [`header-${index}`, header]));
    updateRequest({
      ...collection.request,
      headers: rows.map((row) => ({
        ...(originalById.get(row.id) ?? {}),
        name: row.name,
        value: row.value,
        disabled: !row.enabled
      }))
    });
  };

  const handleVariablesChange = (rows: KeyValueRow[]) => {
    const originals = collection.request?.variables ?? [];
    const originalById = new Map(originals.map((variable, index): [string, typeof variable] => [`variable-${index}`, variable]));
    updateRequest({
      ...collection.request,
      variables: rows.map((row) => {
        const original = originalById.get(row.id);
        const value = original && unwrapVariableValue(original.value) === row.value ? original.value : row.value;
        return { ...(original ?? {}), name: row.name, value, disabled: !row.enabled };
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
  const docs = getCollectionDocs(collection.docs);

  const enabledCount = <T extends { disabled?: boolean }>(items: T[]): number | undefined =>
    items.filter((item) => !item.disabled).length || undefined;

  const scriptCount = [scripts.preRequest, scripts.postResponse].filter((s) => Boolean(s && s.trim())).length || undefined;

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: docs?.trim() ? (
        <OverviewTab docs={docs} />
      ) : (
        <EmptyState
          testId="overview-empty"
          icon={<BookIcon />}
          heading="No overview content yet"
          subheading="This collection has no description or readme. Add one in Bruno to introduce your API to readers — what it does, who it's for, and how to authenticate."
        />
      )
    },
    {
      id: 'headers',
      label: 'Headers',
      contentIndicator: enabledCount(headers),
      content: (
        <HeadersTab
          headers={headers}
          onHeadersChange={handleHeadersChange}
          description="Request headers sent with every request in this collection."
        />
      )
    },
    {
      id: 'variables',
      label: 'Vars',
      contentIndicator: enabledCount(variables),
      content: (
        <VariablesTab
          variables={variables}
          onVariablesChange={handleVariablesChange}
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
