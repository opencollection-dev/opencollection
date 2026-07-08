import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { describe, it, expect } from 'vitest';
import { createOpenCollectionStore } from '../store/store';
import { setDocsCollection } from '../store/slices/docs';
import { setActiveEnv, setShowVars } from '../store/slices/env';
import { useVariableResolver } from './useVariableResolver';

const collection: any = {
  request: { variables: [{ name: 'collectionVar', value: 'cval' }] },
  config: {
    environments: [
      {
        name: 'Dev',
        variables: [
          { name: 'baseUrl', value: 'https://dev.test' },
          { secret: true, name: 'authToken' }
        ]
      },
      { name: 'Prod', variables: [{ name: 'baseUrl', value: 'https://prod.test' }] }
    ]
  }
};

const Probe: React.FC = () => {
  const r = useVariableResolver();
  return (
    <div>
      <span data-testid="base">{r.resolve('{{baseUrl}}')}</span>
      <span data-testid="coll">{r.resolve('{{collectionVar}}')}</span>
      <span data-testid="secret-ref">{String(r.secretRefName('{{authToken}}'))}</span>
      <span data-testid="secret-resolve">{r.resolve('Bearer {{authToken}}')}</span>
    </div>
  );
};

const render = (configure: (store: ReturnType<typeof createOpenCollectionStore>) => void): string => {
  const store = createOpenCollectionStore();
  store.dispatch(setDocsCollection(collection));
  configure(store);
  return renderToStaticMarkup(
    <Provider store={store}>
      <Probe />
    </Provider>
  );
};

describe('useVariableResolver', () => {
  it('returns raw placeholders when showVars is off', () => {
    const html = render((s) => s.dispatch(setActiveEnv('Dev')));
    expect(html).toContain('<span data-testid="base">{{baseUrl}}</span>');
    expect(html).toContain('<span data-testid="coll">{{collectionVar}}</span>');
  });

  it('resolves env + collection vars against the active env when on', () => {
    const html = render((s) => {
      s.dispatch(setActiveEnv('Dev'));
      s.dispatch(setShowVars(true));
    });
    expect(html).toContain('<span data-testid="base">https://dev.test</span>');
    expect(html).toContain('<span data-testid="coll">cval</span>');
  });

  it('reflects the active env (switching changes the value)', () => {
    const html = render((s) => {
      s.dispatch(setActiveEnv('Prod'));
      s.dispatch(setShowVars(true));
    });
    expect(html).toContain('<span data-testid="base">https://prod.test</span>');
  });

  it('never resolves a secret to plaintext, even when on', () => {
    const html = render((s) => {
      s.dispatch(setActiveEnv('Dev'));
      s.dispatch(setShowVars(true));
    });
    expect(html).toContain('<span data-testid="secret-ref">authToken</span>');
    expect(html).toContain('<span data-testid="secret-resolve">Bearer {{authToken}}</span>');
  });
});
