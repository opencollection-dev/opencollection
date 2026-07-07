import type { Environment } from '@opencollection/types/config/environments';
import type {
  Variable,
  SecretVariable,
  VariableValueOrVariants,
  VariableValueType
} from '@opencollection/types/common/variables';
import { MANAGER_LABELS, TYPE_LABELS } from '../constants';
import { descriptionText } from './request';

const humanizeType = (type: VariableValueType | undefined): string => (type && TYPE_LABELS[type]) || 'String';

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

const isSecretVariable = (variable: Variable | SecretVariable): variable is SecretVariable =>
  (variable as SecretVariable).secret === true;

const resolveValue = (value: VariableValueOrVariants | undefined): { value: string; type: VariableValueType } => {
  if (value == null) return { value: '', type: 'string' };
  if (typeof value === 'string') return { value, type: 'string' };
  if (Array.isArray(value)) {
    const selected = value.find((variant) => variant.selected) ?? value[0];
    return selected ? resolveValue(selected.value) : { value: '', type: 'string' };
  }
  return { value: typeof value.data === 'string' ? value.data : '', type: value.type ?? 'string' };
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
        description: descriptionText(variable.description),
        disabled: variable.disabled === true
      });
      return;
    }
    const resolved = resolveValue(variable.value);
    variables.push({
      name: variable.name,
      value: resolved.value,
      dataType: resolved.value ? humanizeType(resolved.type) : '',
      description: descriptionText(variable.description),
      disabled: variable.disabled === true
    });
  });

  return {
    variables,
    secretVariables,
    externalSecrets: environment ? getExternalSecrets(environment) : null
  };
};
