import React, { createContext, useContext, useMemo } from 'react';
import type { OpenCollection } from '@opencollection/types';
import type { Environment } from '@opencollection/types/config/environments';
import type { Variable, SecretVariable } from '@opencollection/types/common/variables';
import { useAppSelector } from '../store/hooks';
import { selectDocsCollection } from '../store/slices/docs';
import { selectActiveEnvName, selectShowVars } from '../store/slices/env';
import {
  buildVariableModel,
  resolveVariables,
  singleReferenceName
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
export interface VariableResolver {
  showVars: boolean;
  activeEnvName: string | null;
  resolve: (raw: string) => string;
  isSecret: (name: string) => boolean;
  secretRefName: (raw: string) => string | null;
}

export const useVariableResolver = (): VariableResolver => {
  const collection = useAppSelector(selectDocsCollection) as OpenCollection | null;
  const activeEnvName = useAppSelector(selectActiveEnvName);
  const showVars = useAppSelector(selectShowVars);

  const model = useMemo(() => {
    const collectionVariables = (collection?.request?.variables ?? []) as (Variable | SecretVariable)[];
    const environments = (collection?.config?.environments ?? []) as Environment[];
    const activeEnvironment = environments.find((environment) => environment.name === activeEnvName);
    return buildVariableModel(collectionVariables, activeEnvironment);
  }, [collection, activeEnvName]);

  return useMemo<VariableResolver>(() => {
    const isSecret = (name: string) => model.secretNames.has(name.trim());
    return {
      showVars,
      activeEnvName,
      isSecret,
      resolve: (raw: string) => (showVars ? resolveVariables(raw, model.values) : raw),
      secretRefName: (raw: string) => {
        const name = singleReferenceName(raw);
        return name && isSecret(name) ? name : null;
      }
    };
  }, [showVars, activeEnvName, model]);
};

/**
 * Passthrough resolver: show-vars off, identity resolve. It is the context
 * default so a `VariableText` rendered without a provider (unit tests, isolated
 * previews) simply shows raw `{{var}}` tokens (no store required).
 */
const PASSTHROUGH_RESOLVER: VariableResolver = {
  showVars: false,
  activeEnvName: null,
  resolve: (raw) => raw,
  isSecret: () => false,
  secretRefName: () => null
};

const VariableResolverContext = createContext<VariableResolver>(PASSTHROUGH_RESOLVER);

/** Consume the active resolver (falls back to passthrough with no provider). */
export const useResolvedVariables = (): VariableResolver => useContext(VariableResolverContext);

/**
 * Provides the store-backed resolver to descendants. Mounted once at the app
 * shell so every `{{var}}` render site resolves against one active environment,
 * without each site subscribing to the store itself.
 */
export const VariableResolverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <VariableResolverContext.Provider value={useVariableResolver()}>{children}</VariableResolverContext.Provider>
);
