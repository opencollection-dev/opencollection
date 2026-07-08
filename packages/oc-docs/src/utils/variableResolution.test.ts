import { describe, it, expect } from 'vitest';
import {
  buildVariableModel,
  resolveVariables,
  singleReferenceName,
  unwrapVariableValue
} from './variableResolution';

describe('unwrapVariableValue', () => {
  it('returns strings as-is and empty for nullish', () => {
    expect(unwrapVariableValue('x')).toBe('x');
    expect(unwrapVariableValue(undefined)).toBe('');
  });

  it('unwraps a typed value', () => {
    expect(unwrapVariableValue({ type: 'string', data: 'TYPED' })).toBe('TYPED');
  });

  it('picks the selected variant, else the first', () => {
    expect(
      unwrapVariableValue([
        { title: 'a', value: 'first' },
        { title: 'b', selected: true, value: 'chosen' }
      ])
    ).toBe('chosen');
    expect(unwrapVariableValue([{ title: 'a', value: 'first' }])).toBe('first');
  });
});

describe('buildVariableModel', () => {
  const env: any = {
    name: 'Dev',
    variables: [
      { name: 'baseUrl', value: 'https://dev.test' },
      { name: 'off', value: 'x', disabled: true },
      { secret: true, name: 'authToken' }
    ]
  };

  it('merges collection + active env, env overriding collection', () => {
    const collectionVars: any = [
      { name: 'baseUrl', value: 'https://collection.test' },
      { name: 'shared', value: 'c' }
    ];
    const { values } = buildVariableModel(collectionVars, env);
    expect(values.baseUrl).toBe('https://dev.test');
    expect(values.shared).toBe('c');
  });

  it('skips disabled vars and never exposes secret values', () => {
    const { values, secretNames } = buildVariableModel([], env);
    expect(values.off).toBeUndefined();
    expect(values.authToken).toBeUndefined();
    expect(secretNames.has('authToken')).toBe(true);
  });

  it('never leaks a value when a name is secret in one source (non-secret added first)', () => {
    const collectionVars: any = [{ name: 'authToken', value: 'plaintext-abc' }];
    const activeEnv: any = { name: 'Dev', variables: [{ secret: true, name: 'authToken' }] };
    const { values, secretNames } = buildVariableModel(collectionVars, activeEnv);
    expect(values.authToken).toBeUndefined();
    expect(secretNames.has('authToken')).toBe(true);
  });

  it('never leaks a value when a name is secret in one source (secret added first)', () => {
    const collectionVars: any = [{ secret: true, name: 'authToken' }];
    const activeEnv: any = { name: 'Dev', variables: [{ name: 'authToken', value: 'plaintext-xyz' }] };
    const { values, secretNames } = buildVariableModel(collectionVars, activeEnv);
    expect(values.authToken).toBeUndefined();
    expect(secretNames.has('authToken')).toBe(true);
  });
});

describe('resolveVariables', () => {
  const values = { host: 'localhost:8081' };

  it('replaces known references and leaves unknown ones untouched', () => {
    expect(resolveVariables('{{host}}/api', values)).toBe('localhost:8081/api');
    expect(resolveVariables('{{missing}}/api', values)).toBe('{{missing}}/api');
  });

  it('passes through non-strings', () => {
    expect(resolveVariables('', values)).toBe('');
  });
});

describe('singleReferenceName', () => {
  it('returns the name only for an exact single reference', () => {
    expect(singleReferenceName('{{authToken}}')).toBe('authToken');
    expect(singleReferenceName('  {{ authToken }} ')).toBe('authToken');
    expect(singleReferenceName('Bearer {{authToken}}')).toBeNull();
    expect(singleReferenceName('plain')).toBeNull();
  });
});
