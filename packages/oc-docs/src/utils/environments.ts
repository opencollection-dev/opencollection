import type { Environment } from '@opencollection/types/config/environments';
import type { Variable, VariableValueOrVariants, VariableValueType } from '@opencollection/types/common/variables';
import { MANAGER_LABELS } from '../constants';
import { getDescription, getVariableType } from './request';
import { isSecretVariable, unwrapVariableValue } from './variableResolution';

export const humanizeType = (type: VariableValueType | undefined): string => type || 'string';

const humanizeManager = (type: string | undefined): string => {
  if (!type) return 'External';
  return (
    MANAGER_LABELS[type] ||
    type
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
};

// keeps the value's original shape
export const writeBackValue = (
  original: VariableValueOrVariants | undefined,
  edited: string
): VariableValueOrVariants => {
  if (Array.isArray(original)) {
    const selected = Math.max(0, original.findIndex((variant) => variant.selected));
    return original.map((variant, index) => (index === selected ? { ...variant, value: edited } : variant));
  }
  if (original && typeof original === 'object') return { ...original, data: edited };
  return edited;
};

export interface EnvVarRow {
  id: string;
  name: string;
  value: string;
  enabled: boolean;
  dataType?: string;
  secret?: boolean;
  source?: Variable;
}

export const envVariableToRow = (variable: Variable, index: number): EnvVarRow => ({
  id: `var-${index}`,
  name: variable.name || '',
  value: unwrapVariableValue(variable.value),
  dataType: humanizeType(getVariableType(variable)),
  enabled: !variable.disabled,
  secret: isSecretVariable(variable),
  source: variable
});

export const envRowToVariable = (row: EnvVarRow): Variable => {
  const source = row.source ?? ({} as Variable);
  if (row.secret) {
    const secret = { ...source, name: row.name, disabled: !row.enabled, secret: true } as Variable & { value?: unknown };
    if (row.value) secret.value = row.value;
    else delete secret.value;
    return secret;
  }
  return { ...source, name: row.name, value: writeBackValue(source.value, row.value), disabled: !row.enabled };
};

interface ExternalSecretsConfig {
  type?: string;
  variables?: { name?: string; secretName?: string; enabled?: boolean; type?: VariableValueType }[];
}

export interface EnvironmentVariableRow {
  name: string;
  value: string;
  dataType: string;
  description?: string;
  disabled: boolean;
}

export interface ExternalSecretRow {
  name: string;
  secretName: string;
  dataType: string;
  disabled: boolean;
}

export interface EnvironmentExternalSecrets {
  type: string;
  typeLabel: string;
  variables: ExternalSecretRow[];
}

export interface EnvironmentVariableGroups {
  variables: EnvironmentVariableRow[];
  secretVariables: EnvironmentVariableRow[];
  externalSecrets: EnvironmentExternalSecrets | null;
}

const getExternalSecrets = (environment: Environment): EnvironmentExternalSecrets | null => {
  const config = (environment as { externalSecrets?: ExternalSecretsConfig }).externalSecrets;
  const variables = (config?.variables ?? [])
    .filter((variable) => variable && variable.name)
    .map((variable) => ({
      name: variable.name ?? '',
      secretName: variable.secretName ?? '',
      dataType: variable.type ? humanizeType(variable.type) : '',
      disabled: variable.enabled === false
    }));

  if (!variables.length) return null;
  return { type: config?.type ?? '', typeLabel: humanizeManager(config?.type), variables };
};

export const getEnvironmentVariables = (environment: Environment | null | undefined): EnvironmentVariableGroups => {
  const variables: EnvironmentVariableRow[] = [];
  const secretVariables: EnvironmentVariableRow[] = [];

  (environment?.variables ?? []).forEach((variable) => {
    if (isSecretVariable(variable)) {
      secretVariables.push({
        name: variable.name ?? '',
        value: '',
        dataType: variable.type ? humanizeType(variable.type) : '',
        description: getDescription(variable),
        disabled: variable.disabled === true
      });
      return;
    }
    const value = unwrapVariableValue(variable.value);
    variables.push({
      name: variable.name,
      value,
      dataType: value ? humanizeType(getVariableType(variable)) : '',
      description: getDescription(variable),
      disabled: variable.disabled === true
    });
  });

  return {
    variables,
    secretVariables,
    externalSecrets: environment ? getExternalSecrets(environment) : null
  };
};
