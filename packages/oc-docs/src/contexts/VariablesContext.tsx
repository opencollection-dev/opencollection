import React, { createContext, useContext, useMemo } from 'react';
import type { OpenCollection } from '@opencollection/types';
import type { Item } from '@opencollection/types/collection/item';
import { useAppSelector } from '../store/hooks';
import { selectActiveEnvironmentName } from '../store/slices/docs';
import { resolveVariableInfo, type VariableInfo } from '../utils/variableInfo';

export type VariableResolver = (name: string) => VariableInfo | null;

const VariablesContext = createContext<VariableResolver>(() => null);

export const useVariableResolver = (): VariableResolver => useContext(VariablesContext);

interface VariablesProviderProps {
  collection?: OpenCollection | null;
  ancestry?: Item[];
  item?: Item | null;
  children: React.ReactNode;
}

export const VariablesProvider: React.FC<VariablesProviderProps> = ({ collection, ancestry, item, children }) => {
  const environmentName = useAppSelector(selectActiveEnvironmentName);
  const resolve = useMemo<VariableResolver>(
    () => (name: string) => resolveVariableInfo(name, { collection, environmentName, ancestry, item }),
    [collection, environmentName, ancestry, item]
  );
  return <VariablesContext.Provider value={resolve}>{children}</VariablesContext.Provider>;
};

export default VariablesProvider;
