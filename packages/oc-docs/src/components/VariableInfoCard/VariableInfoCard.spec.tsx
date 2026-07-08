import React from 'react';
import { Provider } from 'react-redux';
import { describe, it, expect } from 'vitest';
import { createOpenCollectionStore } from '../../store/store';
import { setDocsCollection } from '../../store/slices/docs';
import { setActiveEnv } from '../../store/slices/env';
import { VariableResolverProvider } from '../../hooks';
import { useRenderToDom } from '../../hooks/useRenderToDom';
import { VariableInfoCard } from './VariableInfoCard';

const collection: any = {
  request: {
    variables: [
      { name: 'apiVersion', value: '2024-01' },
      { name: 'profile', value: { type: 'object', data: { city: 'NYC', zip: 10001 } } }
    ]
  },
  config: {
    environments: [
      {
        name: 'Dev',
        variables: [
          { name: 'host', value: 'https://dev.test' },
          { name: 'endpoint', value: '{{host}}/v1' },
          { name: 'bearer_token', value: 'super-secret', secret: true }
        ]
      }
    ]
  }
};

const cardTree = (name: string) => {
  const store = createOpenCollectionStore();
  store.dispatch(setDocsCollection(collection));
  store.dispatch(setActiveEnv('Dev'));
  return (
    <Provider store={store}>
      <VariableResolverProvider>
        <VariableInfoCard name={name} />
      </VariableResolverProvider>
    </Provider>
  );
};

const part = (root: ReturnType<typeof useRenderToDom>, suffix: string) =>
  root.querySelector(`[data-testid="variable-info-card-${suffix}"]`);

describe('VariableInfoCard', () => {
  it('shows name + scope badge + resolved value for an environment variable', () => {
    const root = useRenderToDom(cardTree('host'));
    expect(part(root, 'name')?.text).toBe('host');
    expect(part(root, 'scope')?.text).toBe('Environment');
    expect(part(root, 'value')?.text).toBe('https://dev.test');
  });

  it('labels a collection variable and resolves references recursively', () => {
    expect(part(useRenderToDom(cardTree('apiVersion')), 'scope')?.text).toBe('Collection');
    expect(part(useRenderToDom(cardTree('endpoint')), 'value')?.text).toBe('https://dev.test/v1');
  });

  it('masks a secret value with a reveal toggle and never prints the plaintext', () => {
    const root = useRenderToDom(cardTree('bearer_token'));
    const value = part(root, 'value')?.text ?? '';
    expect(value).not.toContain('super-secret');
    expect(value.length).toBeGreaterThan(0);
    expect(/^\*+$/.test(value)).toBe(true);
    expect(part(root, 'reveal')).not.toBeNull();
    expect(part(root, 'copy')).not.toBeNull();
  });

  it('pretty-prints an object-typed value', () => {
    const value = part(useRenderToDom(cardTree('profile')), 'value')?.text ?? '';
    expect(JSON.parse(value)).toEqual({ city: 'NYC', zip: 10001 });
    expect(value).toContain('\n');
  });

  it('warns on an invalid variable name and shows no value', () => {
    const root = useRenderToDom(cardTree('bad name'));
    expect(part(root, 'warning')).not.toBeNull();
    expect(part(root, 'value')).toBeNull();
  });

  it('marks process.env as read-only', () => {
    const root = useRenderToDom(cardTree('process.env.HOME'));
    expect(part(root, 'scope')?.text).toBe('Process Env');
    expect(part(root, 'note')?.text).toBe('read-only');
  });

  it('notes a dynamic variable and shows no value', () => {
    const root = useRenderToDom(cardTree('$randomInt'));
    expect(part(root, 'scope')?.text).toBe('Dynamic');
    expect(part(root, 'note')?.text).toContain('random value');
    expect(part(root, 'value')).toBeNull();
  });

  it('reports an undefined variable with a note', () => {
    const root = useRenderToDom(cardTree('nope'));
    expect(part(root, 'scope')?.text).toBe('Undefined');
    expect(part(root, 'note')?.text).toBe('Variable is not defined');
  });
});
