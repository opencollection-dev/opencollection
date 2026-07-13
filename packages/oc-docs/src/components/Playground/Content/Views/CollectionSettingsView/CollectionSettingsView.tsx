import React, { useState } from 'react';
import type { OpenCollection } from '@opencollection/types';
import type { VariableValue, VariableValueOrVariants } from '@opencollection/types/common/variables';
import type { Action, ActionSetVariable } from '@opencollection/types/common/actions';
import Tabs from '../../../../../ui/Tabs/Tabs';
import { type KeyValueRow } from '../../../../../components/KeyValueTable/KeyValueTable';
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
import { StyledWrapper } from './StyledWrapper';

const isAfterResponseSetVariable = (action: Action): action is ActionSetVariable =>
  action.type === 'set-variable' && action.phase === 'after-response';

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
        disabled: !row.enabled,
        ...(row.description !== undefined ? { description: row.description } : {})
      }))
    });
  };

  const handleVariablesChange = (rows: KeyValueRow[]) => {
    const originals = collection.request?.variables ?? [];
    const originalByName = new Map(originals.filter((variable) => variable.name).map((variable): [string, typeof variable] => [variable.name as string, variable]));

    const reconcileVariable = (row: KeyValueRow) => {
      const original = originalByName.get(row.name);
      if (!original) return { name: row.name, value: row.value, disabled: !row.enabled };

      // The flat editor only surfaces a variable's string value, so leave the original value
      // untouched while that string is unchanged (preserving its declared data type and any
      // non-selected variants) and only rebuild it once the user edits the string.
      const originalValue = 'value' in original ? original.value : undefined;
      const isUnchanged = unwrapVariableValue(originalValue) === row.value;
      const value = isUnchanged ? originalValue : rewriteVariableValue(originalValue, row.value);
      return { ...original, name: row.name, value, disabled: !row.enabled };
    };

    updateRequest({ ...collection.request, variables: rows.map(reconcileVariable) });
  };

  const handlePostResponseVarsChange = (rows: KeyValueRow[]) => {
    const otherActions = (collection.request?.actions ?? []).filter((action) => !isAfterResponseSetVariable(action));
    const postActions: ActionSetVariable[] = rows.map((row) => ({
      type: 'set-variable',
      phase: 'after-response',
      selector: { expression: row.value, method: 'jsonq' },
      variable: { name: row.name, scope: row.scope || 'runtime' },
      disabled: !row.enabled,
      ...(row.description !== undefined ? { description: row.description } : {})
    }));
    updateRequest({ ...collection.request, actions: [...otherActions, ...postActions] });
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
  const postResponseVars = (collection.request?.actions ?? [])
    .filter(isAfterResponseSetVariable)
    .map((action) => ({
      name: action.variable?.name,
      expr: action.selector?.expression,
      disabled: action.disabled,
      scope: action.variable?.scope,
      description: action.description
    }));
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
          description="Add request headers that will be sent with every request in this collection."
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
          postResponseVars={postResponseVars}
          onPostResponseVarsChange={handlePostResponseVarsChange}
          exprHelp="You can write any valid JS Template Literal here"
          title=""
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
          description="Configures authentication for the entire collection. This applies to all requests using the Inherit option in the Auth tab."
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
          description="Write pre and post-request scripts that will run before and after any request in this collection is sent."
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
          description="These tests will run any time a request in this collection is sent."
        />
      )
    }
  ];

  return (
    <StyledWrapper>
      <div className="collection-settings-header">
        <h2 className="collection-settings-title">
          {collection.info?.name || 'Collection Settings'}
        </h2>
        {version && <span className="collection-settings-version">Version {version}</span>}
      </div>

      <div className="collection-settings-tabs">
        <Tabs
          tabs={tabs.map((tab) => ({
            ...tab,
            content: <div className="collection-settings-tab-content">{tab.content}</div>
          }))}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          testId="collection-settings-tabs"
        />
      </div>
    </StyledWrapper>
  );
};

export default CollectionSettings;
