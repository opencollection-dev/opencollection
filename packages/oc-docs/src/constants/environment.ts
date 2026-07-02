import type { VariableValueType } from '@opencollection/types/common/variables';

export const TYPE_LABELS: Record<VariableValueType, string> = {
  string: 'String',
  number: 'Number',
  boolean: 'Boolean',
  null: 'Null',
  object: 'Object'
};

export const MANAGER_LABELS: Record<string, string> = {
  vault: 'Vault',
  'vault-server': 'Vault Server',
  'vault-cloud': 'Vault Cloud',
  'aws-secrets-manager': 'AWS Secrets Manager',
  'azure-key-vault': 'Azure Key Vault'
};
