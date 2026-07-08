import React, { createContext, useContext, useMemo } from 'react';
import type { OpenCollection } from '@opencollection/types';
import type { Environment } from '@opencollection/types/config/environments';
import type { Item } from '@opencollection/types/collection/item';
import type { Variable, SecretVariable } from '@opencollection/types/common/variables';
import { useAppSelector } from '../store/hooks';
import { selectDocsCollection } from '../store/slices/docs';
import { selectActiveEnvName, selectShowVars } from '../store/slices/env';
import { getRequestVariables, isFolder } from '../utils/schemaHelpers';
import {
  buildScopedVariableModel,
  resolveVariables,
  singleReferenceName,
  detectSpecialScope,
  isValidVariableName,
  formatEntryValue,
  referencesSecret,
  type ScopedVariableModel,
  type VariableScope,
  type VariableSource
} from '../utils/variableResolution';

/**
 * Shared variable resolution hook, the contract redesigned doc sections
 * consume. It resolves `{{var}}` against the active environment (the env slice),
 * gated by the show-variables flag, with secret variables always masked.
 *
 * - showVars off → `resolve()` returns the raw string (`{{baseUrl}}`).
 * - showVars on  → `resolve()` returns the interpolated value.
 * - Secret variables never resolve to plaintext: their values are excluded from
 *   the map (so a `{{secret}}` reference is left as-is), and a value that is
 *   exactly a secret reference is reported by `secretRefName()` so the caller
 *   can mask the whole cell.
 */
export interface VariableLookup {
  name: string;
  scope: VariableScope;
  displayValue: string;
  copyValue: string;
  secret: boolean;
  valid: boolean;
}

export interface VariableResolver {
  showVars: boolean;
  activeEnvName: string | null;
  resolve: (raw: string) => string;
  isSecret: (name: string) => boolean;
  secretRefName: (raw: string) => string | null;
  lookup: (name: string) => VariableLookup;
}

const lookupVariable = (rawName: string, model: ScopedVariableModel): VariableLookup => {
  const name = (rawName ?? '').trim();
  const base = { name, displayValue: '', copyValue: '', secret: false };

  const special = detectSpecialScope(name);
  if (special) return { ...base, scope: special, valid: true };
  if (!isValidVariableName(name)) return { ...base, scope: 'undefined', valid: false };

  const entry = model.entries[name];
  if (!entry) return { ...base, scope: 'undefined', valid: true };

  const value = formatEntryValue(entry, model.fullValues);
  const secret = entry.secret || model.secretNames.has(name) || referencesSecret(entry.value, model.secretNames);
  return { name, scope: entry.scope, displayValue: value, copyValue: value, secret, valid: true };
};

const makeResolver = (
  model: ScopedVariableModel,
  showVars: boolean,
  activeEnvName: string | null
): VariableResolver => {
  const isSecret = (name: string) => model.secretNames.has(name.trim());
  return {
    showVars,
    activeEnvName,
    isSecret,
    resolve: (raw: string) => (showVars ? resolveVariables(raw, model.values) : raw),
    secretRefName: (raw: string) => {
      const name = singleReferenceName(raw);
      return name && isSecret(name) ? name : null;
    },
    lookup: (name: string) => lookupVariable(name, model)
  };
};

const collectionAndEnvSources = (collection: OpenCollection | null, activeEnvName: string | null): VariableSource[] => {
  const collectionVariables = (collection?.request?.variables ?? []) as (Variable | SecretVariable)[];
  const environments = (collection?.config?.environments ?? []) as Environment[];
  const activeEnvironment = environments.find((environment) => environment.name === activeEnvName);
  return [
    { scope: 'collection', variables: collectionVariables },
    { scope: 'environment', variables: activeEnvironment?.variables }
  ];
};

const folderVariables = (folder: Item): (Variable | SecretVariable)[] =>
  ((folder as { request?: { variables?: unknown[] } }).request?.variables ?? []) as (Variable | SecretVariable)[];

export const useVariableResolver = (): VariableResolver => {
  const collection = useAppSelector(selectDocsCollection) as OpenCollection | null;
  const activeEnvName = useAppSelector(selectActiveEnvName);
  const showVars = useAppSelector(selectShowVars);

  const model = useMemo(
    () => buildScopedVariableModel(collectionAndEnvSources(collection, activeEnvName)),
    [collection, activeEnvName]
  );

  return useMemo(() => makeResolver(model, showVars, activeEnvName), [model, showVars, activeEnvName]);
};

/**
 * Passthrough resolver: show-vars off, identity resolve, empty lookup. It is the
 * context default so a `VariableText` rendered without a provider (unit tests,
 * isolated previews) simply shows raw `{{var}}` tokens (no store required) and a
 * hover card degrades to an "undefined" scope rather than throwing.
 */
const PASSTHROUGH_RESOLVER: VariableResolver = {
  showVars: false,
  activeEnvName: null,
  resolve: (raw) => raw,
  isSecret: () => false,
  secretRefName: () => null,
  lookup: (name) => ({ name: (name ?? '').trim(), scope: 'undefined', displayValue: '', copyValue: '', secret: false, valid: true })
};

const VariableResolverContext = createContext<VariableResolver>(PASSTHROUGH_RESOLVER);

/** Consume the active resolver (falls back to passthrough with no provider). */
export const useResolvedVariables = (): VariableResolver => useContext(VariableResolverContext);

/**
 * Provides the store-backed resolver (collection + active environment) to
 * descendants. Mounted once at the app shell so every `{{var}}` render site
 * resolves against one active environment without each site subscribing to the
 * store itself.
 */
export const VariableResolverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <VariableResolverContext.Provider value={useVariableResolver()}>{children}</VariableResolverContext.Provider>
);

export const ItemVariableResolverProvider: React.FC<{
  collection: OpenCollection | null;
  ancestry: Item[];
  item: Item | null;
  children: React.ReactNode;
}> = ({ collection, ancestry, item, children }) => {
  const activeEnvName = useAppSelector(selectActiveEnvName);
  const showVars = useAppSelector(selectShowVars);

  const model = useMemo(() => {
    const sources: VariableSource[] = collectionAndEnvSources(collection, activeEnvName);
    for (const folder of ancestry) {
      sources.push({ scope: 'folder', variables: folderVariables(folder) });
    }
    if (item) {
      if (isFolder(item)) {
        sources.push({ scope: 'folder', variables: folderVariables(item) });
      } else {
        sources.push({ scope: 'request', variables: getRequestVariables(item as never) as (Variable | SecretVariable)[] });
      }
    }
    return buildScopedVariableModel(sources);
  }, [collection, activeEnvName, ancestry, item]);

  const resolver = useMemo(() => makeResolver(model, showVars, activeEnvName), [model, showVars, activeEnvName]);

  return <VariableResolverContext.Provider value={resolver}>{children}</VariableResolverContext.Provider>;
};
