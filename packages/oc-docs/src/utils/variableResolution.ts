import type { Environment } from '@opencollection/types/config/environments';
import type {
  Variable,
  SecretVariable,
  VariableValueOrVariants
} from '@opencollection/types/common/variables';
import { isTemplateVariable, templateVariableGlobalRegex } from './common';

/**
 * Pure, DOM-free variable resolution for read-only display. Kept separate from
 * the request runner's interpolator (which mutates a request for execution):
 * this one takes a string and returns a string, the shape redesigned doc
 * sections consume. The `{{var}}` pattern itself comes from the shared
 * template-variable helpers in `common`, so there is one definition app-wide.
 */

/** A flat map of variable name to its resolved string value. */
export type VariableMap = Record<string, string>;

export interface VariableModel {
  values: VariableMap;
  secretNames: Set<string>;
}

const isSecretVariable = (variable: Variable | SecretVariable): variable is SecretVariable =>
  (variable as SecretVariable).secret === true;

/** Flatten a `string | { type, data } | variants[]` value into a display string. */
export const unwrapVariableValue = (value: VariableValueOrVariants | undefined): string => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    const chosen = value.find((variant) => variant.selected) ?? value[0];
    return chosen ? unwrapVariableValue(chosen.value) : '';
  }
  if (typeof value === 'object' && 'data' in value) return String(value.data ?? '');
  return String(value);
};

/**
 * Build a resolution model from the collection's variables and the active
 * environment. Collection variables are the base; the active environment
 * overrides them. Secret variables are recorded by name but never given a
 * value, so they can never resolve to plaintext.
 */
export const buildVariableModel = (
  collectionVariables: (Variable | SecretVariable)[] | undefined,
  activeEnvironment: Environment | undefined
): VariableModel => {
  const values: VariableMap = {};
  const secretNames = new Set<string>();

  const add = (variable: Variable | SecretVariable) => {
    if (!variable.name || variable.disabled) return;
    if (isSecretVariable(variable)) {
      secretNames.add(variable.name);
      return;
    }
    values[variable.name] = unwrapVariableValue((variable as Variable).value);
  };

  (collectionVariables ?? []).forEach(add);
  (activeEnvironment?.variables ?? []).forEach(add);

  // A name marked secret by ANY source is authoritative: drop any plaintext a
  // non-secret source of the same name contributed, so a secret can never
  // resolve to a value (regardless of which source was added first).
  for (const name of secretNames) delete values[name];

  return { values, secretNames };
};

/** Replace every `{{name}}` with its value, leaving unknown names untouched. */
export const resolveVariables = (raw: string, values: VariableMap): string => {
  if (!raw || typeof raw !== 'string') return raw;
  return raw.replace(templateVariableGlobalRegex(), (match, name) => {
    const value = values[name.trim()];
    return value === undefined ? match : value;
  });
};

/**
 * If `raw` is exactly one `{{name}}` reference, return the trimmed name;
 * otherwise null. Lets a caller detect a cell that is a single reference.
 */
export const singleReferenceName = (raw: string): string | null => {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!isTemplateVariable(trimmed)) return null;
  return trimmed.slice(2, -2).trim();
};
