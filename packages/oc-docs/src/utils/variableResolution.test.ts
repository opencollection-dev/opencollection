import { describe, it, expect } from 'vitest';
import {
  buildVariableModel,
  resolveVariables,
  singleReferenceName,
  unwrapVariableValue,
  unwrapVariableTyped,
  buildScopedVariableModel,
  resolveValueDeep,
  detectSpecialScope,
  referencesSecret,
  isValidVariableName,
  formatEntryValue
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

describe('unwrapVariableTyped', () => {
  it('returns plain strings and empty for nullish', () => {
    expect(unwrapVariableTyped('x')).toEqual({ value: 'x' });
    expect(unwrapVariableTyped(undefined)).toEqual({ value: '' });
  });

  it('preserves the declared dataType and JSON-stringifies object data', () => {
    expect(unwrapVariableTyped({ type: 'string', data: 'TYPED' } as any)).toEqual({ value: 'TYPED', dataType: 'string' });
    expect(unwrapVariableTyped({ type: 'object', data: { a: 1 } } as any)).toEqual({ value: '{"a":1}', dataType: 'object' });
  });
});

describe('buildScopedVariableModel', () => {
  it('applies precedence request > folder > environment > collection (last source wins)', () => {
    const model = buildScopedVariableModel([
      { scope: 'collection', variables: [{ name: 'x', value: 'c' }, { name: 'onlyC', value: 'cc' }] as any },
      { scope: 'environment', variables: [{ name: 'x', value: 'e' }] as any },
      { scope: 'folder', variables: [{ name: 'x', value: 'f' }] as any },
      { scope: 'request', variables: [{ name: 'x', value: 'r' }] as any }
    ]);
    expect(model.values.x).toBe('r');
    expect(model.entries.x.scope).toBe('request');
    expect(model.entries.onlyC.scope).toBe('collection');
  });

  it('lets the deepest folder win over shallower ones', () => {
    const model = buildScopedVariableModel([
      { scope: 'folder', variables: [{ name: 'y', value: 'shallow' }] as any },
      { scope: 'folder', variables: [{ name: 'y', value: 'deep' }] as any }
    ]);
    expect(model.values.y).toBe('deep');
  });

  it('tracks secrets: value hidden from values but kept in fullValues for reveal', () => {
    const model = buildScopedVariableModel([
      { scope: 'environment', variables: [{ name: 's', secret: true, value: 'shh' }] as any }
    ]);
    expect(model.secretNames.has('s')).toBe(true);
    expect(model.values.s).toBeUndefined();
    expect(model.fullValues.s).toBe('shh');
    expect(model.entries.s.secret).toBe(true);
  });

  it('skips disabled variables', () => {
    const model = buildScopedVariableModel([
      { scope: 'collection', variables: [{ name: 'off', value: 'x', disabled: true }] as any }
    ]);
    expect(model.entries.off).toBeUndefined();
  });
});

describe('resolveValueDeep', () => {
  it('resolves references through chains', () => {
    const values = { a: '{{b}}', b: 'B', endpoint: '{{host}}/v1', host: 'H' };
    expect(resolveValueDeep('{{a}}', values)).toBe('B');
    expect(resolveValueDeep('{{endpoint}}', values)).toBe('H/v1');
  });

  it('does not loop forever on a cycle', () => {
    expect(() => resolveValueDeep('{{x}}', { x: '{{y}}', y: '{{x}}' })).not.toThrow();
  });
});

describe('detectSpecialScope', () => {
  it('classifies $-prefixed and process.env references, else null', () => {
    expect(detectSpecialScope('$oauth2.token')).toBe('oauth2');
    expect(detectSpecialScope('$secrets.KEY')).toBe('$secrets');
    expect(detectSpecialScope('$randomInt')).toBe('dynamic');
    expect(detectSpecialScope('process.env.HOME')).toBe('process.env');
    expect(detectSpecialScope('baseUrl')).toBeNull();
  });
});

describe('referencesSecret', () => {
  const secrets = new Set(['token']);
  it('detects a reference to a secret name', () => {
    expect(referencesSecret('Bearer {{token}}', secrets)).toBe(true);
    expect(referencesSecret('{{public}}', secrets)).toBe(false);
    expect(referencesSecret('no refs', secrets)).toBe(false);
  });
});

describe('isValidVariableName', () => {
  it('accepts alpha-numeric plus - _ . and rejects spaces', () => {
    expect(isValidVariableName('good_name.1-2')).toBe(true);
    expect(isValidVariableName('bad name')).toBe(false);
  });
});

describe('formatEntryValue', () => {
  it('deep-resolves references for non-object values', () => {
    expect(formatEntryValue({ value: '{{host}}/x', scope: 'collection', secret: false } as any, { host: 'H' })).toBe('H/x');
  });

  it('pretty-prints an object-typed value', () => {
    const entry = { value: '{"b":2,"a":1}', scope: 'collection', secret: false, dataType: 'object' } as any;
    expect(formatEntryValue(entry, {})).toBe(JSON.stringify(JSON.parse(entry.value), null, 2));
  });
});
