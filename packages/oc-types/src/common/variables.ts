/**
 * Variables and related value types defined in the schema
 */

import type { Description } from './description';

export type VariableValueType = 'string' | 'number' | 'boolean' | 'null' | 'object';

export interface VariableTypedValue {
  type: VariableValueType;
  data: string;
}

export type VariableValue = string | VariableTypedValue;

export interface VariableValueVariant {
  title: string;
  selected?: boolean;
  value: VariableValue;
}

export type VariableValueOrVariants = VariableValue | VariableValueVariant[];

export interface Variable {
  name: string;
  value?: VariableValueOrVariants;
  description?: Description;
  disabled?: boolean;
}

export interface SecretVariable {
  secret: true;
  name?: string;
  description?: Description;
  disabled?: boolean;
  type?: VariableValueType;
}

interface BaseExternalSecretVariable {
  name: string;
  description?: Description;
  disabled?: boolean;
}

export interface HashicorpVaultExternalSecret extends BaseExternalSecretVariable {
  path: string;
}

export interface AwsSecretsManagerExternalSecret extends BaseExternalSecretVariable {
  secretName: string;
}

export interface AzureKeyVaultExternalSecret extends BaseExternalSecretVariable {
  vaultName: string;
}

export type ExternalSecretVariable =
  | HashicorpVaultExternalSecret
  | AwsSecretsManagerExternalSecret
  | AzureKeyVaultExternalSecret;

export type SecretProviderType =
  | 'hashicorp-vault-cloud'
  | 'hashicorp-vault-server'
  | 'aws-secrets-manager'
  | 'azure-key-vault';

export interface ExternalSecrets {
  type: SecretProviderType;
  variables?: ExternalSecretVariable[];
}
