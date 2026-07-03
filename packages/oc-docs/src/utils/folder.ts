import type { OpenCollection } from '@opencollection/types';
import type { Item, Folder } from '@opencollection/types/collection/item';
import type { Auth } from '@opencollection/types/common/auth';
import type { Variable } from '@opencollection/types/common/variables';
import { getItemName, isFolder, isScriptFile, scriptsArrayToObject } from './schemaHelpers';

export interface FolderHeaderRow {
  name: string;
  value: string;
  disabled?: boolean;
}

export interface FolderVariableRow {
  name: string;
  value: string;
  disabled?: boolean;
}

export interface FolderAuthSource {
  level: 'collection' | 'folder';
  name: string;
}

export interface FolderConfig {
  headers: FolderHeaderRow[];
  auth?: Auth;
  authSource?: FolderAuthSource;
  preRequest?: string;
  postResponse?: string;
  tests?: string;
  variables: FolderVariableRow[];
}

const isConcrete = (auth: Auth | undefined): boolean => !!auth && auth !== 'inherit';

const folderAuthOf = (item: Item): Auth | undefined => (item as { request?: { auth?: Auth } }).request?.auth;

const flattenValue = (value: Variable['value']): string => {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    const selected = value.find((variant) => variant.selected) ?? value[0];
    return selected ? flattenValue(selected.value) : '';
  }
  return typeof value.data === 'string' ? value.data : '';
};

export const resolveFolderAuth = (
  collection: OpenCollection | null | undefined,
  ancestors: Item[],
  folder: Folder
): { auth?: Auth; source?: FolderAuthSource } => {
  const own = folder.request?.auth;
  if (own !== 'inherit') return { auth: own };

  for (let i = ancestors.length - 1; i >= 0; i -= 1) {
    const auth = folderAuthOf(ancestors[i]);
    if (isConcrete(auth)) {
      return { auth, source: { level: 'folder', name: getItemName(ancestors[i]) || 'Folder' } };
    }
  }

  const collectionAuth = collection?.request?.auth as Auth | undefined;
  if (isConcrete(collectionAuth)) {
    return { auth: collectionAuth, source: { level: 'collection', name: collection?.info?.name || 'Collection' } };
  }

  return { auth: 'inherit' };
};

export const getFolderConfig = (
  collection: OpenCollection | null | undefined,
  ancestors: Item[],
  folder: Folder
): FolderConfig => {
  const headers = (folder.request?.headers ?? [])
    .filter((header) => header && header.name && header.disabled !== true)
    .map((header) => ({ name: header.name, value: header.value, disabled: header.disabled }));

  const { auth, source } = resolveFolderAuth(collection, ancestors, folder);
  const scripts = scriptsArrayToObject(folder.request?.scripts);

  const variables = (folder.request?.variables ?? [])
    .filter((variable) => variable && variable.name)
    .map((variable) => ({ name: variable.name, value: flattenValue(variable.value), disabled: variable.disabled }));

  return {
    headers,
    auth: isConcrete(auth) ? auth : undefined,
    authSource: source,
    preRequest: scripts.preRequest,
    postResponse: scripts.postResponse,
    tests: scripts.tests,
    variables
  };
};

export const hasFolderConfig = (config: FolderConfig): boolean =>
  config.headers.length > 0 ||
  Boolean(config.auth) ||
  Boolean(config.preRequest || config.postResponse || config.tests) ||
  config.variables.length > 0;

export const countFolderRequests = (folder: Folder): number => {
  let count = 0;
  const walk = (items: Item[] | undefined): void => {
    for (const item of items ?? []) {
      if (isFolder(item)) {
        walk((item as Folder).items);
      } else if (!isScriptFile(item)) {
        count += 1;
      }
    }
  };
  walk(folder.items);
  return count;
};
