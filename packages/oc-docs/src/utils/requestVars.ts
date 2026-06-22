import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Variable } from '@opencollection/types/common/variables';
import { getRequestVariables } from './schemaHelpers';

export interface PreRequestVarRow {
  name: string;
  value: string;
  disabled?: boolean;
}

export interface PostResponseVarRow {
  name: string;
  expression: string;
  scope?: string;
  disabled?: boolean;
}

/** Flatten a variable value (string, typed value, or selected variant) to a display string. */
const flattenValue = (value: Variable['value']): string => {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    const selected = value.find((v) => v.selected) ?? value[0];
    return selected ? flattenValue(selected.value) : '';
  }
  return typeof value.data === 'string' ? value.data : '';
};

/** Pre-request variables (request-level `runtime.variables`). */
export const getPreRequestVars = (item: HttpRequest): PreRequestVarRow[] =>
  getRequestVariables(item).map((v: Variable) => ({
    name: v.name,
    value: flattenValue(v.value),
    disabled: v.disabled
  }));

/** Post-response captures (`runtime.actions` set-variable, after-response). */
export const getPostResponseVars = (item: HttpRequest): PostResponseVarRow[] => {
  const actions = item.runtime?.actions ?? [];
  return actions
    .filter((a) => a.type === 'set-variable' && (a.phase ?? 'after-response') === 'after-response')
    .map((a) => ({
      name: a.variable.name,
      expression: a.selector.expression,
      scope: a.variable.scope,
      disabled: a.disabled
    }));
};
