import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { describe, it, expect } from 'vitest';
import { createOpenCollectionStore } from '../../store/store';
import { setDocsCollection } from '../../store/slices/docs';
import { setActiveEnv, setShowVars } from '../../store/slices/env';
import { VariableResolverProvider } from '../../hooks';
import { CodeSnippetTabs } from './CodeSnippetTabs';

const collection: any = {
  config: { environments: [{ name: 'Dev', variables: [{ name: 'baseUrl', value: 'https://dev.test' }] }] }
};

const render = (configure?: (s: ReturnType<typeof createOpenCollectionStore>) => void): string => {
  const store = createOpenCollectionStore();
  store.dispatch(setDocsCollection(collection));
  configure?.(store);
  return renderToStaticMarkup(
    <Provider store={store}>
      <VariableResolverProvider>
        <CodeSnippetTabs
          method="post"
          url="{{baseUrl}}/api/v1/auth/login"
          headers={[{ name: 'Content-Type', value: 'application/json' }]}
          body={{ type: 'json', data: '{"email":"a@b.com"}' }}
        />
      </VariableResolverProvider>
    </Provider>
  );
};

describe('CodeSnippetTabs', () => {
  it('renders language tabs and the default cURL snippet', () => {
    const html = render();
    expect(html).toContain('cURL');
    expect(html).toContain('Javascript');
    expect(html).toContain('Python');
    expect(html).toContain('curl --request POST');
  });

  it('leaves {{variable}} placeholders raw when show-vars is off', () => {
    const html = render();
    expect(html).toContain('{{baseUrl}}/api/v1/auth/login');
  });

  it('resolves {{variable}} in the snippet against the active env when show-vars is on', () => {
    const html = render((s) => {
      s.dispatch(setActiveEnv('Dev'));
      s.dispatch(setShowVars(true));
    });
    expect(html).toContain('https://dev.test/api/v1/auth/login');
    expect(html).not.toContain('{{baseUrl}}');
  });
});
