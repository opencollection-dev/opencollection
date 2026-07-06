import type { OpenCollection } from '@opencollection/types';
import type { Item } from '@opencollection/types/collection/item';
import type { Environment } from '@opencollection/types/config/environments';
import type { Variable, SecretVariable, VariableValueOrVariants } from '@opencollection/types/common/variables';

export type VariableScope = 'request' | 'folder' | 'environment' | 'collection';

export interface VariableInfo {
  name: string;
  scope: VariableScope;
  scopeLabel: string;
  value: string;
  secret: boolean;
}

export interface VariableResolutionContext {
  collection?: OpenCollection | null;
  environmentName?: string | null;
  ancestry?: Item[];
  item?: Item | null;
}

const SCOPE_LABELS: Record<VariableScope, string> = {
  request: 'Request',
  folder: 'Folder',
  environment: 'Environment',
  collection: 'Collection'
};

export const getVariableName = (token: string): string => token.replace(/^\{\{/, '').replace(/\}\}$/, '').trim();

const flattenValue = (value: VariableValueOrVariants | undefined): string => {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    const selected = value.find((variant) => variant.selected) ?? value[0];
    return selected ? flattenValue(selected.value) : '';
  }
  return typeof value.data === 'string' ? value.data : '';
};

const isEnabled = (variable: { disabled?: boolean } | undefined): boolean => Boolean(variable) && variable!.disabled !== true;

const requestVariables = (item: Item | null | undefined): Variable[] =>
  ((item as { runtime?: { variables?: Variable[] } } | null | undefined)?.runtime?.variables ?? []);

const folderVariables = (folder: Item): Variable[] =>
  ((folder as { request?: { variables?: Variable[] } }).request?.variables ?? []);

const findEnvironment = (
  collection: OpenCollection | null | undefined,
  environmentName: string | null | undefined
): Environment | undefined => {
  const environments = collection?.config?.environments ?? [];
  if (!environments.length) return undefined;
  if (environmentName) return environments.find((environment) => environment.name === environmentName) ?? environments[0];
  return environments[0];
};

const isSecretVariable = (variable: Variable | SecretVariable): variable is SecretVariable =>
  (variable as SecretVariable).secret === true;

const buildInfo = (name: string, scope: VariableScope, value: string, secret: boolean): VariableInfo => ({
  name,
  scope,
  scopeLabel: SCOPE_LABELS[scope],
  value,
  secret
});

export const resolveVariableInfo = (name: string, context: VariableResolutionContext): VariableInfo | null => {
  if (!name) return null;
  const { collection, environmentName, ancestry = [], item } = context;

  const requestVar = requestVariables(item).find((variable) => variable && variable.name === name && isEnabled(variable));
  if (requestVar) return buildInfo(name, 'request', flattenValue(requestVar.value), false);

  for (let i = ancestry.length - 1; i >= 0; i -= 1) {
    const folderVar = folderVariables(ancestry[i]).find((variable) => variable && variable.name === name && isEnabled(variable));
    if (folderVar) return buildInfo(name, 'folder', flattenValue(folderVar.value), false);
  }

  const environment = findEnvironment(collection, environmentName);
  const envVar = (environment?.variables ?? []).find((variable) => variable && variable.name === name && isEnabled(variable));
  if (envVar) {
    if (isSecretVariable(envVar)) return buildInfo(name, 'environment', '', true);
    return buildInfo(name, 'environment', flattenValue(envVar.value), false);
  }

  const collectionVars = (collection as { request?: { variables?: Variable[] } } | null | undefined)?.request?.variables ?? [];
  const collectionVar = collectionVars.find((variable) => variable && variable.name === name && isEnabled(variable));
  if (collectionVar) return buildInfo(name, 'collection', flattenValue(collectionVar.value), false);

  return null;
};
