import { describe, it, expect } from 'vitest';
import { getEnvironmentVariables, envVariableToRow, envRowToVariable } from './environments';

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
      { name: 'baseUrl', value: 'https://api.test', dataType: 'string', disabled: false }
    ]);
    expect(secretVariables).toEqual([
      { name: 'authToken', value: '', dataType: 'string', disabled: false }
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
      'count:8842:number',
      'enabled:true:boolean',
      'payload:{}:object'
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
    expect(getEnvironmentVariables(env).variables[0]).toMatchObject({ value: 'eu-west-1', dataType: 'string' });
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
    expect(getEnvironmentVariables(env).externalSecrets?.variables.map((v) => v.dataType)).toEqual(['string', '']);
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

describe('envVariableToRow / envRowToVariable round-trip', () => {
  const roundTrip = (variable: any, index = 0) => envRowToVariable(envVariableToRow(variable, index)) as any;

  it('keeps a plain string variable', () => {
    const out = roundTrip({ name: 'host', value: 'http://localhost:8081' });
    expect(out.name).toBe('host');
    expect(out.value).toBe('http://localhost:8081');
  });

  it('preserves a variant array instead of flattening it to the selected value', () => {
    const apiBase = {
      name: 'api_base',
      value: [
        { title: 'dev', value: 'https://dev.api.local', selected: true },
        { title: 'prod', value: 'https://prod.api.local' }
      ]
    };
    const out = roundTrip(apiBase);
    expect(Array.isArray(out.value)).toBe(true);
    expect(out.value).toEqual(apiBase.value);
  });

  it('preserves a typed value wrapper instead of flattening to a bare string', () => {
    const out = roundTrip({ name: 'timeout', value: { type: 'number', data: '30' } });
    expect(out.value).toEqual({ type: 'number', data: '30' });
  });

  it('never writes a value onto a secret with no value and keeps its type', () => {
    const out = roundTrip({ name: 'bearer_auth_token', secret: true, type: 'string' });
    expect(out.secret).toBe(true);
    expect(out.type).toBe('string');
    expect('value' in out).toBe(false);
  });

  it('keeps an entered secret value so the request can resolve it on send', () => {
    const out = envRowToVariable({
      id: 'var-0',
      name: 'bearer_auth_token',
      value: 'real-token',
      enabled: true,
      secret: true,
      source: { name: 'bearer_auth_token', secret: true, type: 'string' } as any
    }) as any;
    expect(out.secret).toBe(true);
    expect(out.value).toBe('real-token');
  });

  it('wraps the value as a typed { type, data } when the row data type is switched to a non-string type', () => {
    const row = { ...envVariableToRow({ name: 'port', value: '8080' }, 0), dataType: 'number' };
    expect(envRowToVariable(row).value).toEqual({ type: 'number', data: '8080' });
  });

  it('flattens a typed value back to a plain string when the row data type is switched to string', () => {
    const row = { ...envVariableToRow({ name: 'port', value: { type: 'number', data: '8080' } }, 0), dataType: 'string' };
    expect(envRowToVariable(row).value).toBe('8080');
  });

  it('keeps the declared type when only the value is edited', () => {
    const row = { ...envVariableToRow({ name: 'port', value: { type: 'number', data: '8080' } }, 0), value: '9090' };
    expect(envRowToVariable(row).value).toEqual({ type: 'number', data: '9090' });
  });

  it('builds a typed value for a brand-new row that has no source variable', () => {
    const out = envRowToVariable({ id: 'var-0', name: 'retries', value: '3', enabled: true, dataType: 'number' });
    expect(out).toEqual({ name: 'retries', value: { type: 'number', data: '3' }, disabled: false });
  });
});
