import type { Environment } from '@opencollection/types/config/environments';
import type { Variable, VariableValueType } from '@opencollection/types/common/variables';
import { MANAGER_LABELS } from '../constants';
import { getDescription, getVariableTypeLabel } from './request';
import { isSecretVariable, unwrapVariableValue } from './variableResolution';
import { rowToVariable } from './variableDataType';

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
  dataType: getVariableTypeLabel(variable),
  enabled: !variable.disabled,
  secret: isSecretVariable(variable),
  source: variable
});

export const envRowToVariable = (row: EnvVarRow): Variable => {
  const source = row.source ?? ({} as Variable);
  if (row.secret) {
    const secret = { ...source, name: row.name, disabled: !row.enabled, secret: true } as Variable & { value?: string };
    if (row.value) secret.value = row.value;
    else delete secret.value;
    return secret;
  }
  return rowToVariable({
    name: row.name,
    value: row.value,
    enabled: row.enabled,
    dataType: row.dataType,
    description: source.description,
    originalValue: source.value
  });
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
      dataType: variable.type ?? '',
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
        dataType: variable.type ?? '',
        description: getDescription(variable),
        disabled: variable.disabled === true
      });
      return;
    }
    const value = unwrapVariableValue(variable.value);
    variables.push({
      name: variable.name,
      value,
      dataType: value ? getVariableTypeLabel(variable) : '',
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
