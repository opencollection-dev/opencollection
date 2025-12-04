import type { OpenCollection } from '@opencollection/types';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Variable } from '@opencollection/types/common/variables';
import { getTreePathFromCollectionToItem } from './tree-utils';

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
  const requestVariables: Record<string, string> = {};
  
  // Start with collection-level variables
  const collectionVars = collection.request?.variables || [];
  collectionVars.forEach((variable) => {
    if (!variable.disabled) {
      variables.set(variable.name, variable);
      const value = typeof variable.value === 'string' ? variable.value : String(variable.value || '');
      collectionVariables[variable.name] = value;
    }
  });
  
  // Apply folder-level variables in order (parent to child)
  for (const item of requestTreePath) {
    if (item.type === 'folder') {
      const folderVars = item.request?.variables || [];
      folderVars.forEach((variable) => {
        if (!variable.disabled) {
          variables.set(variable.name, variable);
          const value = typeof variable.value === 'string' ? variable.value : String(variable.value || '');
          folderVariables[variable.name] = value;
        }
      });
    }
  }
  
  // Initialize request variables if not present
  if (!request.variables) {
    request.variables = [];
  }
  
  // Process request-level variables
  request.variables.forEach((variable) => {
    if (!variable.disabled) {
      const value = typeof variable.value === 'string' ? variable.value : String(variable.value || '');
      requestVariables[variable.name] = value;
    }
  });
  
  // Merge with existing request variables (request variables take precedence)
  const requestVarMap = new Map<string, Variable>();
  request.variables.forEach((variable) => {
    requestVarMap.set(variable.name, variable);
  });
  
  // Add merged variables that don't exist in request
  variables.forEach((variable, name) => {
    if (!requestVarMap.has(name)) {
      request.variables!.push(variable);
    }
  });
  
  // Add variable scope tracking to the request object for debugging/inspection
  return { 
    collectionVariables,
    folderVariables,
    requestVariables
  };
};
