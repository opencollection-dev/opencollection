import type { Environment } from '@opencollection/types/config/environments';
import type {
  Variable,
  SecretVariable,
  VariableValueOrVariants,
  VariableValueType
} from '@opencollection/types/common/variables';
import { isTemplateVariable, templateVariableGlobalRegex } from './common';
import { VARIABLE_NAME_REGEX } from '../constants/regex';

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

export type VariableScope =
  | 'collection'
  | 'environment'
  | 'folder'
  | 'request'
  | 'process.env'
  | 'dynamic'
  | 'oauth2'
  | '$secrets'
  | 'undefined';

export type ConcreteScope = 'collection' | 'environment' | 'folder' | 'request';

export interface VariableSource {
  scope: ConcreteScope;
  variables: (Variable | SecretVariable)[] | undefined;
}

export interface VariableEntry {
  value: string;
  scope: ConcreteScope;
  secret: boolean;
  dataType?: VariableValueType;
}

export interface ScopedVariableModel extends VariableModel {
  entries: Record<string, VariableEntry>;
  fullValues: VariableMap;
}

export const unwrapVariableTyped = (
  value: VariableValueOrVariants | undefined
): { value: string; dataType?: VariableValueType } => {
  if (value === undefined || value === null) return { value: '' };
  if (typeof value === 'string') return { value };
  if (Array.isArray(value)) {
    const chosen = value.find((variant) => variant.selected) ?? value[0];
    return chosen ? unwrapVariableTyped(chosen.value) : { value: '' };
  }
  if (typeof value === 'object' && 'data' in value) {
    const typed = value as { type?: VariableValueType; data?: unknown };
    const { data } = typed;
    const flat = data === undefined || data === null ? '' : typeof data === 'object' ? JSON.stringify(data) : String(data);
    return { value: flat, dataType: typed.type };
  }
  return { value: String(value) };
};

export const buildScopedVariableModel = (sources: VariableSource[]): ScopedVariableModel => {
  const values: VariableMap = {};
  const fullValues: VariableMap = {};
  const secretNames = new Set<string>();
  const entries: Record<string, VariableEntry> = {};

  for (const source of sources) {
    for (const variable of source.variables ?? []) {
      if (!variable.name || variable.disabled) continue;
      const secret = isSecretVariable(variable);
      const { value, dataType } = unwrapVariableTyped((variable as Variable).value);
      entries[variable.name] = { value, scope: source.scope, secret, dataType };
      fullValues[variable.name] = value;
      if (secret) {
        secretNames.add(variable.name);
      } else {
        values[variable.name] = value;
      }
    }
  }

  for (const name of secretNames) delete values[name];

  return { values, secretNames, entries, fullValues };
};

export const resolveValueDeep = (raw: string, values: VariableMap, maxDepth = 10): string => {
  let current = raw;
  for (let depth = 0; depth < maxDepth; depth += 1) {
    const next = resolveVariables(current, values);
    if (next === current) break;
    current = next;
  }
  return current;
};

export const detectSpecialScope = (name: string): VariableScope | null => {
  if (name.startsWith('$oauth2.')) return 'oauth2';
  if (name.startsWith('$secrets.')) return '$secrets';
  if (name.startsWith('$')) return 'dynamic';
  if (name.startsWith('process.env.')) return 'process.env';
  return null;
};

export const referencesSecret = (raw: string, secretNames: Set<string>): boolean => {
  if (!raw || typeof raw !== 'string' || secretNames.size === 0) return false;
  const pattern = templateVariableGlobalRegex();
  let match: RegExpExecArray | null = pattern.exec(raw);
  while (match !== null) {
    if (secretNames.has(match[1].trim())) return true;
    match = pattern.exec(raw);
  }
  return false;
};

export const isValidVariableName = (name: string): boolean => name.length > 0 && VARIABLE_NAME_REGEX.test(name);

export const formatEntryValue = (entry: VariableEntry, values: VariableMap): string => {
  if (entry.dataType === 'object') {
    try {
      return JSON.stringify(JSON.parse(entry.value), null, 2);
    } catch {
      return entry.value;
    }
  }
  return resolveValueDeep(entry.value, values);
};
