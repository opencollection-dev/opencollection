import type { OpenCollection } from '@opencollection/types';
import type { Environment } from '@opencollection/types/config/environments';
import type { Variable } from '@opencollection/types/common/variables';

export interface VariablesForHighlighting {
  [key: string]: string | undefined;
}

/**
 * Extract value from a Variable object which can have multiple formats
 */
const extractVariableValue = (variable: Variable): string => {
  if (!variable.value) return '';
  
  if (typeof variable.value === 'string') {
    return variable.value;
  }
  
  // Handle object format with type and data
  if (typeof variable.value === 'object' && 'type' in variable.value) {
    return variable.value.data || '';
  }
  
  // Handle array format (multiple values with selection)
  if (Array.isArray(variable.value)) {
    const selected = variable.value.find(v => v.selected) || variable.value[0];
    if (selected) {
      if (typeof selected.value === 'string') {
        return selected.value;
      }
      if (typeof selected.value === 'object' && 'type' in selected.value) {
        return selected.value.data || '';
      }
    }
  }
  
  return String(variable.value);
};

/**
 * Get environment variables from a collection for a given environment name
 */
export const getEnvironmentVariables = (
  collection: OpenCollection | null | undefined,
  environmentName: string
): VariablesForHighlighting => {
  if (!collection || !environmentName) return {};
  
  // Support both root level and config level environments
  const environments = (collection as any).environments || collection?.config?.environments || [];
  const environment = environments.find((env: Environment) => env.name === environmentName);
  
  if (!environment?.variables) return {};
  
  const variables: VariablesForHighlighting = {};
  
  for (const variable of environment.variables) {
    if (variable.name && !variable.disabled) {
      variables[variable.name] = extractVariableValue(variable);
    }
  }
  
  return variables;
};

/**
 * Get all variables available for highlighting in the playground.
 * Currently this only includes environment variables.
 * 
 * @param collection - The OpenCollection collection
 * @param selectedEnvironment - The name of the selected environment
 */
export const getAllVariablesForHighlighting = (
  collection: OpenCollection | null | undefined,
  selectedEnvironment: string
): VariablesForHighlighting => {
  return getEnvironmentVariables(collection, selectedEnvironment);
};

/**
 * Variable pattern source - matches {{variableName}}
 * Use createVariableRegex() for iteration to avoid stateful global regex issues
 */
export const VARIABLE_PATTERN_SOURCE = '\\{\\{([^{}]+)\\}\\}';

/**
 * Creates a fresh regex instance for variable matching.
 * Always use this for iteration instead of a global regex to avoid state issues.
 */
export const createVariableRegex = (): RegExp => new RegExp(VARIABLE_PATTERN_SOURCE, 'g');

/**
 * @deprecated Use VARIABLE_PATTERN_SOURCE and createVariableRegex() instead
 * Kept for backward compatibility
 */
export const VARIABLE_PATTERN = /\{\{([^{}]+)\}\}/g;

/**
 * Check if a variable exists in the variables object
 */
export const isVariableDefined = (
  variableName: string,
  variables: VariablesForHighlighting
): boolean => {
  return variableName in variables;
};

/**
 * Find all variables in a string and return their positions and validity
 */
export interface VariableMatch {
  name: string;
  start: number;
  end: number;
  isValid: boolean;
  fullMatch: string;
}

export const findVariablesInText = (
  text: string,
  variables: VariablesForHighlighting
): VariableMatch[] => {
  const matches: VariableMatch[] = [];
  const regex = createVariableRegex();
  let match;

  while ((match = regex.exec(text)) !== null) {
    const variableName = match[1].trim();
    matches.push({
      name: variableName,
      start: match.index,
      end: match.index + match[0].length,
      isValid: isVariableDefined(variableName, variables),
      fullMatch: match[0]
    });
  }

  return matches;
};
