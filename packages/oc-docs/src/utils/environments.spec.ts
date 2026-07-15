import { describe, it, expect } from 'vitest';
import { getEnvironmentVariables, writeBackValue } from './environments';
import { unwrapVariableValue } from './variableResolution';

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
      { name: 'baseUrl', value: 'https://api.test', dataType: 'String', disabled: false }
    ]);
    expect(secretVariables).toEqual([
      { name: 'authToken', value: '', dataType: 'String', disabled: false }
    ]);
  });

  it('carries plain and secret variable descriptions through, flattening string and { content }', () => {
    const env: any = {
      name: 'Dev',
      variables: [
        { name: 'baseUrl', value: 'https://api.test', description: 'API base URL' },
        { name: 'authToken', secret: true, type: 'string', description: { content: 'Bearer token', type: 'text' } }
      ]
    };
    const { variables, secretVariables } = getEnvironmentVariables(env);
    expect(variables[0].description).toBe('API base URL');
    expect(secretVariables[0].description).toBe('Bearer token');
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
    expect(secretVariables[0]).toMatchObject({ name: 'token', value: '', dataType: '' });
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

  it('labels the Bruno secret manager types (vault / aws / azure)', () => {
    const withType = (type: string) =>
      ({ name: 'Prod', externalSecrets: { type, variables: [{ name: 'x', secretName: 'y' }] } }) as any;
    expect(getEnvironmentVariables(withType('vault')).externalSecrets?.typeLabel).toBe('Vault');
    expect(getEnvironmentVariables(withType('aws-secrets-manager')).externalSecrets?.typeLabel).toBe(
      'AWS Secrets Manager'
    );
    expect(getEnvironmentVariables(withType('azure-key-vault')).externalSecrets?.typeLabel).toBe('Azure Key Vault');
  });
});

describe('writeBackValue', () => {
  it('keeps a plain string a string', () => {
    expect(writeBackValue('old', 'new')).toBe('new');
    expect(writeBackValue(undefined, 'new')).toBe('new');
  });

  it('preserves a typed value wrapper and only swaps the data', () => {
    expect(writeBackValue({ type: 'number', data: '30' }, '42')).toEqual({ type: 'number', data: '42' });
  });

  it('preserves the variant array and edits only the selected variant', () => {
    const variants = [
      { title: 'dev', value: 'https://dev.api.local', selected: true },
      { title: 'prod', value: 'https://prod.api.local' }
    ];
    expect(writeBackValue(variants, 'https://edited.local')).toEqual([
      { title: 'dev', value: 'https://edited.local', selected: true },
      { title: 'prod', value: 'https://prod.api.local' }
    ]);
  });

  it('edits the first variant when none is marked selected', () => {
    const variants = [{ title: 'a', value: 'x' }, { title: 'b', value: 'y' }];
    expect(writeBackValue(variants, 'z')).toEqual([{ title: 'a', value: 'z' }, { title: 'b', value: 'y' }]);
  });

  it('round-trips the shapes that get flattened for display', () => {
    const cases = ['plain', { type: 'number', data: '30' }, [{ title: 'dev', value: 'v', selected: true }]] as const;
    for (const original of cases) {
      const flat = unwrapVariableValue(original);
      // no edit → writing the flattened value back leaves the original shape intact
      expect(writeBackValue(original, flat)).toEqual(original);
    }
  });
});
