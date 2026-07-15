import type { OpenCollection } from '@opencollection/types';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Variable } from '@opencollection/types/common/variables';
import { getTreePathFromCollectionToItem } from './tree-utils';
import { isFolder, getRequestVariables } from '../../utils/schemaHelpers';
import { unwrapVariableTyped } from '../../utils/variableResolution';
import { parseValueByDataType } from '../../utils/variableDataType';

/** Coerce a variable's (possibly typed `{type,data}`) value to its send-time string form. */
const resolveVarString = (rawValue: Variable['value']): string => {
  const { value, dataType } = unwrapVariableTyped(rawValue);
  const coerced = parseValueByDataType(value, dataType);
  if (coerced === null || coerced === undefined) return '';
  return typeof coerced === 'object' ? JSON.stringify(coerced) : String(coerced);
};

/**
 * Merge variables from collection and folder hierarchy into the request
 */
export const getCollectionFolderRequestVariables = (collection: OpenCollection, request: HttpRequest): { collectionVariables: Record<string, string>, folderVariables: Record<string, string>, requestVariables: Record<string, string> } => {
  // Get the tree path from collection to this item
  const requestTreePath = getTreePathFromCollectionToItem(collection, request);

  const variables = new Map<string, Variable>();
  
  // Track variables by scope for debugging/inspection
  const collectionVariables: Record<string, string> = {};
  const folderVariables: Record<string, string> = {};
  const requestVariablesResult: Record<string, string> = {};
  
  // Start with collection-level variables
  const collectionVars = collection.request?.variables || [];
  collectionVars.forEach((variable: any) => {
    if (!variable.disabled) {
      variables.set(variable.name, variable);
      const value = resolveVarString(variable.value);
      collectionVariables[variable.name] = value;
    }
  });
  
  // Apply folder-level variables in order (parent to child)
  for (const item of requestTreePath) {
    if (isFolder(item)) {
      const folderVars = (item as any).request?.variables || [];
      folderVars.forEach((variable: any) => {
        if (!variable.disabled) {
          variables.set(variable.name, variable);
          const value = resolveVarString(variable.value);
          folderVariables[variable.name] = value;
        }
      });
    }
  }
  
  // Get request variables using helper
  const requestVars = getRequestVariables(request);
  
  // Process request-level variables
  requestVars.forEach((variable: any) => {
    if (!variable.disabled) {
      const value = resolveVarString(variable.value);
      requestVariablesResult[variable.name] = value;
    }
  });
  
  // Add variable scope tracking to the request object for debugging/inspection
  return { 
    collectionVariables,
    folderVariables,
    requestVariables: requestVariablesResult
  };
};
