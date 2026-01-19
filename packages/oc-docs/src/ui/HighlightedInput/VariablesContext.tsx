import React, { createContext, useContext, useMemo, useRef } from 'react';
import type { OpenCollection } from '@opencollection/types';
import { getAllVariablesForHighlighting, type VariablesForHighlighting } from '../../utils/variables';

interface VariablesContextValue {
  variables: VariablesForHighlighting;
}

const VariablesContext = createContext<VariablesContextValue>({ variables: {} });

VariablesContext.displayName = 'VariablesContext';

interface VariablesProviderProps {
  collection: OpenCollection | null | undefined;
  selectedEnvironment: string;
  children: React.ReactNode;
}

/**
 * Shallow comparison of two variable objects to detect actual content changes.
 * Returns true if they are equal (no change needed).
 */
const areVariablesEqual = (
  prev: VariablesForHighlighting,
  next: VariablesForHighlighting
): boolean => {
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);

  if (prevKeys.length !== nextKeys.length) return false;

  for (const key of prevKeys) {
    if (prev[key] !== next[key]) return false;
  }

  return true;
};

/**
 * Provider component that supplies variable context for highlighting.
 * Wrap your playground components with this to enable variable highlighting.
 *
 * Optimized to prevent unnecessary re-renders by:
 * - Memoizing the variables computation
 * - Only updating when actual variable content changes
 */
export const VariablesProvider: React.FC<VariablesProviderProps> = ({
  collection,
  selectedEnvironment,
  children
}) => {
  const prevVariablesRef = useRef<VariablesForHighlighting>({});

  const variables = useMemo(() => {
    const newVariables = getAllVariablesForHighlighting(collection, selectedEnvironment);

    if (areVariablesEqual(prevVariablesRef.current, newVariables)) {
      return prevVariablesRef.current;
    }

    prevVariablesRef.current = newVariables;
    return newVariables;
  }, [collection, selectedEnvironment]);

  const value = useMemo(() => ({ variables }), [variables]);

  return (
    <VariablesContext.Provider value={value}>
      {children}
    </VariablesContext.Provider>
  );
};

VariablesProvider.displayName = 'VariablesProvider';

/**
 * Hook to access variables for highlighting.
 * Returns the variables object from context, or an empty object if outside provider.
 */
export const useVariables = (): VariablesForHighlighting => {
  const context = useContext(VariablesContext);
  return context.variables;
};

export default VariablesContext;
