import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { describe, it, expect } from 'vitest';
import { createOpenCollectionStore } from '../../store/store';
import { setDocsCollection } from '../../store/slices/docs';
import { setActiveEnv, setShowVars } from '../../store/slices/env';
import { VariableResolverProvider } from '../../hooks';
import { VariableText } from './VariableText';

const collection: any = {
  config: { environments: [{ name: 'Dev', variables: [{ name: 'baseUrl', value: 'https://dev.test' }] }] }
};

const render = (value: string, configure?: (s: ReturnType<typeof createOpenCollectionStore>) => void): string => {
  const store = createOpenCollectionStore();
  store.dispatch(setDocsCollection(collection));
  configure?.(store);
  return renderToStaticMarkup(
    <Provider store={store}>
      <VariableResolverProvider>
        <VariableText value={value} />
      </VariableResolverProvider>
    </Provider>
  );
};

describe('VariableText', () => {
  it('highlights {{variable}} tokens while leaving surrounding text plain (show-vars off)', () => {
    const html = render('{{baseUrl}}/api/v1/auth');
    expect(html).toContain('<span class="var">{{baseUrl}}</span>');
    expect(html).toContain('/api/v1/auth');
  });

  it('renders plain text without a token span', () => {
    const html = render('application/json');
    expect(html).toContain('application/json');
    expect(html).not.toContain('class="var"');
  });

  it('resolves tokens against the active env when show-vars is on', () => {
    const html = render('{{baseUrl}}/api/v1/auth', (s) => {
      s.dispatch(setActiveEnv('Dev'));
      s.dispatch(setShowVars(true));
    });
    expect(html).toContain('https://dev.test/api/v1/auth');
    expect(html).not.toContain('class="var"');
  });

  it('keeps unknown tokens highlighted even when show-vars is on', () => {
    const html = render('{{unknown}}/x', (s) => {
      s.dispatch(setActiveEnv('Dev'));
      s.dispatch(setShowVars(true));
    });
    expect(html).toContain('<span class="var">{{unknown}}</span>');
  });
});
