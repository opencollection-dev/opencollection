import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { describe, it, expect } from 'vitest';
import { createOpenCollectionStore } from '@store/store';
import { setDocsCollection } from '@slices/docs';
import { setActiveEnv, setShowVars } from '@slices/env';
import { useVariableResolver, useResolvedVariables, ItemVariableResolverProvider } from './useVariableResolver';

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

const LookupProbe: React.FC<{ name: string }> = ({ name }) => {
  const info = useResolvedVariables().lookup(name);
  return (
    <div>
      <span data-testid="scope">{info.scope}</span>
      <span data-testid="value">{info.value}</span>
      <span data-testid="secret">{String(info.secret)}</span>
      <span data-testid="valid">{String(info.valid)}</span>
    </div>
  );
};

describe('lookup (variable hover card)', () => {
  const folder: any = { type: 'folder', name: 'F', request: { variables: [{ name: 'folderScope', value: 'from-folder' }, { name: 'shared', value: 'folderVal' }] } };
  const requestItem: any = { type: 'http', name: 'R', runtime: { variables: [{ name: 'reqScope', value: 'from-req' }, { name: 'shared', value: 'reqVal' }] } };

  const renderLookup = (name: string, showVars = false): string => {
    const store = createOpenCollectionStore();
    store.dispatch(setDocsCollection(collection));
    store.dispatch(setActiveEnv('Dev'));
    if (showVars) store.dispatch(setShowVars(true));
    return renderToStaticMarkup(
      <Provider store={store}>
        <ItemVariableResolverProvider collection={collection} ancestry={[folder]} item={requestItem}>
          <LookupProbe name={name} />
        </ItemVariableResolverProvider>
      </Provider>
    );
  };

  it("resolves a variable's value and scope even when show-variables is off", () => {
    const html = renderLookup('baseUrl');
    expect(html).toContain('<span data-testid="scope">environment</span>');
    expect(html).toContain('<span data-testid="value">https://dev.test</span>');
  });

  it('applies precedence request > folder > environment > collection', () => {
    expect(renderLookup('shared')).toContain('<span data-testid="scope">request</span>');
    expect(renderLookup('reqScope')).toContain('<span data-testid="scope">request</span>');
    expect(renderLookup('folderScope')).toContain('<span data-testid="scope">folder</span>');
    expect(renderLookup('collectionVar')).toContain('<span data-testid="scope">collection</span>');
  });

  it('flags secret env vars and never shows their value', () => {
    const html = renderLookup('authToken');
    expect(html).toContain('<span data-testid="scope">environment</span>');
    expect(html).toContain('<span data-testid="secret">true</span>');
  });

  it('classifies special references (process.env, $dynamic) and flags invalid/unknown names', () => {
    expect(renderLookup('process.env.HOME')).toContain('<span data-testid="scope">process.env</span>');
    expect(renderLookup('$randomInt')).toContain('<span data-testid="scope">dynamic</span>');
    expect(renderLookup('bad name')).toContain('<span data-testid="valid">false</span>');
    expect(renderLookup('unknownVar')).toContain('<span data-testid="scope">undefined</span>');
  });

  it('degrades to an undefined scope with no provider', () => {
    const html = renderToStaticMarkup(<LookupProbe name="anything" />);
    expect(html).toContain('<span data-testid="scope">undefined</span>');
  });
});
