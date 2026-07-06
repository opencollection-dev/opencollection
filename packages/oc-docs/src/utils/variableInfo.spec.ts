import { describe, it, expect } from 'vitest';
import { resolveVariableInfo, getVariableName } from './variableInfo';

const collection: any = {
  info: { name: 'C' },
  config: {
    environments: [
      { name: 'Local', variables: [{ name: 'host', value: 'http://localhost:8081' }, { name: 'token', secret: true }] },
      { name: 'Prod', variables: [{ name: 'host', value: 'https://api.prod' }] }
    ]
  },
  request: { variables: [{ name: 'apiVersion', value: 'v1' }, { name: 'host', value: 'collection-host' }] }
};

const folder: any = { request: { variables: [{ name: 'folderVar', value: 'from-folder' }, { name: 'host', value: 'folder-host' }] } };
const item: any = { runtime: { variables: [{ name: 'reqVar', value: 'from-request' }, { name: 'host', value: 'request-host' }] } };

describe('getVariableName', () => {
  it('strips the {{ }} delimiters and trims', () => {
    expect(getVariableName('{{host}}')).toBe('host');
    expect(getVariableName('{{ host }}')).toBe('host');
    expect(getVariableName('{{process.env.X}}')).toBe('process.env.X');
  });
});

describe('resolveVariableInfo', () => {
  it('resolves an environment variable with its value and scope', () => {
    expect(resolveVariableInfo('host', { collection, environmentName: 'Local' })).toEqual({
      name: 'host',
      scope: 'environment',
      scopeLabel: 'Environment',
      value: 'http://localhost:8081',
      secret: false
    });
  });

  it('uses the selected environment (and falls back to the first when none is set)', () => {
    expect(resolveVariableInfo('host', { collection, environmentName: 'Prod' })?.value).toBe('https://api.prod');
    expect(resolveVariableInfo('host', { collection })?.value).toBe('http://localhost:8081');
  });

  it('marks a secret environment variable and never exposes a value', () => {
    expect(resolveVariableInfo('token', { collection, environmentName: 'Local' })).toEqual({
      name: 'token',
      scope: 'environment',
      scopeLabel: 'Environment',
      value: '',
      secret: true
    });
  });

  it('resolves a collection variable when no higher scope defines it', () => {
    const info = resolveVariableInfo('apiVersion', { collection });
    expect(info).toMatchObject({ scope: 'collection', scopeLabel: 'Collection', value: 'v1' });
  });

  it('honours precedence: request > folder > environment > collection', () => {
    expect(resolveVariableInfo('host', { collection, environmentName: 'Local', ancestry: [folder], item })?.scope).toBe('request');
    expect(resolveVariableInfo('host', { collection, environmentName: 'Local', ancestry: [folder] })?.scope).toBe('folder');
    expect(resolveVariableInfo('host', { collection, environmentName: 'Local' })?.scope).toBe('environment');
  });

  it('resolves request and folder scoped variables', () => {
    expect(resolveVariableInfo('reqVar', { collection, item })).toMatchObject({ scope: 'request', value: 'from-request' });
    expect(resolveVariableInfo('folderVar', { collection, ancestry: [folder] })).toMatchObject({ scope: 'folder', value: 'from-folder' });
  });

  it('skips disabled variables and returns null when undefined', () => {
    const withDisabled: any = { config: { environments: [{ name: 'E', variables: [{ name: 'x', value: '1', disabled: true }] }] } };
    expect(resolveVariableInfo('x', { collection: withDisabled })).toBeNull();
    expect(resolveVariableInfo('missing', { collection })).toBeNull();
    expect(resolveVariableInfo('', { collection })).toBeNull();
  });
});
