import { describe, it, expect } from 'vitest';
import { getEnvironmentVariables } from './environments';

describe('getEnvironmentVariables', () => {
  it('splits regular and secret variables', () => {
    const env: any = {
      name: 'Dev',
      variables: [
        { name: 'baseUrl', value: 'https://api.test' },
        { name: 'authToken', secret: true, type: 'string' }
      ]
    };
    const { variables, secretVariables } = getEnvironmentVariables(env);
    expect(variables).toEqual([
      { name: 'baseUrl', value: 'https://api.test', dataType: 'String', secret: false, disabled: false }
    ]);
    expect(secretVariables).toEqual([
      { name: 'authToken', value: '', dataType: 'String', secret: true, disabled: false }
    ]);
  });

  it('humanizes typed values and reads the typed data', () => {
    const env: any = {
      name: 'Dev',
      variables: [
        { name: 'count', value: { type: 'number', data: '8842' } },
        { name: 'enabled', value: { type: 'boolean', data: 'true' } },
        { name: 'payload', value: { type: 'object', data: '{}' } }
      ]
    };
    expect(getEnvironmentVariables(env).variables.map((v) => `${v.name}:${v.value}:${v.dataType}`)).toEqual([
      'count:8842:Number',
      'enabled:true:Boolean',
      'payload:{}:Object'
    ]);
  });

  it('resolves the selected value from variants', () => {
    const env: any = {
      name: 'Dev',
      variables: [
        {
          name: 'region',
          value: [
            { title: 'us', value: 'us-east-1' },
            { title: 'eu', selected: true, value: 'eu-west-1' }
          ]
        }
      ]
    };
    expect(getEnvironmentVariables(env).variables[0]).toMatchObject({ value: 'eu-west-1', dataType: 'String' });
  });

  it('leaves an untyped secret data type empty and marks disabled rows', () => {
    const env: any = {
      name: 'Dev',
      variables: [
        { name: 'token', secret: true },
        { name: 'legacy', value: 'x', disabled: true }
      ]
    };
    const { variables, secretVariables } = getEnvironmentVariables(env);
    expect(secretVariables[0]).toMatchObject({ dataType: '', secret: true });
    expect(variables[0].disabled).toBe(true);
  });

  it('leaves the data type empty for a variable with no value', () => {
    const env: any = { name: 'Dev', variables: [{ name: 'transactionId', value: '' }, { name: 'reviewId' }] };
    expect(getEnvironmentVariables(env).variables.map((v) => `${v.name}:${v.value}:${v.dataType}`)).toEqual([
      'transactionId::',
      'reviewId::'
    ]);
  });

  it('returns empty groups for a missing environment', () => {
    const empty = { variables: [], secretVariables: [], externalSecrets: null };
    expect(getEnvironmentVariables(null)).toEqual(empty);
    expect(getEnvironmentVariables(undefined)).toEqual(empty);
    expect(getEnvironmentVariables({ name: 'Empty' } as any)).toEqual(empty);
  });

  it('extracts external secrets and humanizes the manager type', () => {
    const env: any = {
      name: 'Prod',
      externalSecrets: {
        type: 'aws-secrets-manager',
        variables: [
          { name: 'dbPassword', secretName: 'prod/db/credentials', enabled: true },
          { name: 'apiKey', secretName: 'prod/payment/api-key', enabled: false }
        ]
      }
    };
    const { externalSecrets } = getEnvironmentVariables(env);
    expect(externalSecrets?.typeLabel).toBe('AWS Secrets Manager');
    expect(externalSecrets?.variables).toEqual([
      { name: 'dbPassword', secretName: 'prod/db/credentials', dataType: '', disabled: false },
      { name: 'apiKey', secretName: 'prod/payment/api-key', dataType: '', disabled: true }
    ]);
  });

  it('reads a data type for external secret variables when present', () => {
    const env: any = {
      name: 'Prod',
      externalSecrets: {
        type: 'aws-secrets-manager',
        variables: [
          { name: 'dbPassword', secretName: 'p', type: 'string' },
          { name: 'apiKey', secretName: 'q' }
        ]
      }
    };
    expect(getEnvironmentVariables(env).externalSecrets?.variables.map((v) => v.dataType)).toEqual(['String', '']);
  });

  it('is null when there are no external secret variables', () => {
    expect(getEnvironmentVariables({ name: 'Dev' } as any).externalSecrets).toBeNull();
    expect(
      getEnvironmentVariables({ name: 'Dev', externalSecrets: { type: 'aws-secrets-manager', variables: [] } } as any)
        .externalSecrets
    ).toBeNull();
  });

  it('title-cases an unknown manager type', () => {
    const env: any = {
      name: 'Prod',
      externalSecrets: { type: 'my-custom-vault', variables: [{ name: 'x', secretName: 'y' }] }
    };
    expect(getEnvironmentVariables(env).externalSecrets?.typeLabel).toBe('My Custom Vault');
  });
});
