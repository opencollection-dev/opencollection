import React from 'react';
import { Provider } from 'react-redux';
import { describe, it, expect } from 'vitest';
import { createOpenCollectionStore } from '../../store/store';
import { setDocsCollection } from '../../store/slices/docs';
import { setActiveEnv, setShowVars } from '../../store/slices/env';
import { VariableResolverProvider } from '../../hooks';
import { useRenderToDom } from '../../hooks/useRenderToDom';
import { VariableText } from './VariableText';

const collection: any = {
  config: { environments: [{ name: 'Dev', variables: [{ name: 'baseUrl', value: 'https://dev.test' }] }] }
};

const tree = (value: string, configure?: (store: ReturnType<typeof createOpenCollectionStore>) => void) => {
  const store = createOpenCollectionStore();
  store.dispatch(setDocsCollection(collection));
  configure?.(store);
  return (
    <Provider store={store}>
      <VariableResolverProvider>
        <VariableText value={value} />
      </VariableResolverProvider>
    </Provider>
  );
};

const withShowVars = (store: ReturnType<typeof createOpenCollectionStore>) => {
  store.dispatch(setActiveEnv('Dev'));
  store.dispatch(setShowVars(true));
};

describe('VariableText', () => {
  it('wraps each {{variable}} token in a highlighted span tagged with its name', () => {
    const root = useRenderToDom(tree('{{baseUrl}}/api/v1/auth'));
    const token = root.querySelector('.var');
    expect(token?.getAttribute('data-var-name')).toBe('baseUrl');
    expect(token?.text).toBe('{{baseUrl}}');
    expect(root.querySelector('.var-text')?.text).toBe('{{baseUrl}}/api/v1/auth');
  });

  it('trims whitespace around the variable name', () => {
    const root = useRenderToDom(tree('{{ spaced }}'));
    expect(root.querySelector('.var')?.getAttribute('data-var-name')).toBe('spaced');
  });

  it('leaves plain text untouched, with no token span', () => {
    const root = useRenderToDom(tree('application/json'));
    expect(root.querySelector('.var')).toBeNull();
    expect(root.querySelector('.var-text')?.text).toBe('application/json');
  });

  it('shows the resolved value but keeps it highlighted as a variable when show-variables is on', () => {
    const root = useRenderToDom(tree('{{baseUrl}}/api/v1/auth', withShowVars));
    const token = root.querySelector('.var');
    expect(token?.getAttribute('data-var-name')).toBe('baseUrl');
    expect(token?.text).toBe('https://dev.test');
    expect(root.querySelector('.var-text')?.text).toBe('https://dev.test/api/v1/auth');
  });

  it('still highlights an unknown variable when show-variables is on', () => {
    const root = useRenderToDom(tree('{{unknown}}/x', withShowVars));
    const token = root.querySelector('.var');
    expect(token?.getAttribute('data-var-name')).toBe('unknown');
    expect(token?.text).toBe('{{unknown}}');
  });
});
