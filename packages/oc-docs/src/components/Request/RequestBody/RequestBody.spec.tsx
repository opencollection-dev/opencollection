import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { describe, it, expect } from 'vitest';
import { createOpenCollectionStore } from '../../../store/store';
import { setDocsCollection } from '../../../store/slices/docs';
import { setActiveEnv, setShowVars } from '../../../store/slices/env';
import { VariableResolverProvider } from '../../../hooks';
import { RequestBody } from './RequestBody';

describe('RequestBody', () => {
  it('renders a JSON body as a labelled code block', () => {
    const html = renderToStaticMarkup(<RequestBody body={{ type: 'json', data: '{"email":"a@b.com"}' }} />);
    expect(html).toContain('application/json');
    expect(html).toContain('language-json');
    expect(html).toContain('a@b.com');
  });

  it('renders a form-urlencoded body as a table', () => {
    const html = renderToStaticMarkup(
      <RequestBody body={{ type: 'form-urlencoded', data: [{ name: 'name', value: 'Alice' }] }} />
    );
    expect(html).toContain('application/x-www-form-urlencoded');
    expect(html).toContain('name');
    expect(html).toContain('Alice');
  });

  it('tags multipart file parts and surfaces part descriptions', () => {
    const html = renderToStaticMarkup(
      <RequestBody
        body={{
          type: 'multipart-form',
          data: [{ name: 'avatar', type: 'file', value: '/tmp/a.png', description: 'profile picture' }]
        }}
      />
    );
    expect(html).toContain('request-body-file-tag');
    expect(html).toContain('/tmp/a.png');
    expect(html).toContain('profile picture');
  });

  it('surfaces a per-part content type', () => {
    const html = renderToStaticMarkup(
      <RequestBody
        body={{ type: 'multipart-form', data: [{ name: 'meta', type: 'text', value: '{}', contentType: 'application/json' }] }}
      />
    );
    expect(html).toContain('request-body-content-type');
    expect(html).toContain('application/json');
  });

  it('renders every file-body variant with its content type and marks the selected one', () => {
    const html = renderToStaticMarkup(
      <RequestBody
        body={{
          type: 'file',
          data: [
            { filePath: '/a.json', contentType: 'application/json', selected: false },
            { filePath: '/b.xml', contentType: 'application/xml', selected: true }
          ]
        }}
      />
    );
    expect(html).toContain('/a.json');
    expect(html).toContain('application/json');
    expect(html).toContain('/b.xml');
    expect(html).toContain('selected');
  });

  it('resolves {{variable}} in a raw/JSON body code block when show-vars is on', () => {
    const collection: any = {
      config: { environments: [{ name: 'Dev', variables: [{ name: 'baseUrl', value: 'https://dev.test' }] }] }
    };
    const store = createOpenCollectionStore();
    store.dispatch(setDocsCollection(collection));
    store.dispatch(setActiveEnv('Dev'));
    store.dispatch(setShowVars(true));
    const html = renderToStaticMarkup(
      <Provider store={store}>
        <VariableResolverProvider>
          <RequestBody body={{ type: 'json', data: '{"url":"{{baseUrl}}/x"}' }} />
        </VariableResolverProvider>
      </Provider>
    );
    expect(html).toContain('https://dev.test/x');
    expect(html).not.toContain('{{baseUrl}}');
  });

  it('renders nothing for an empty/none body', () => {
    expect(renderToStaticMarkup(<RequestBody body={undefined} />)).toBe('');
    expect(renderToStaticMarkup(<RequestBody body={{ type: 'form-urlencoded', data: [] }} />)).toBe('');
    expect(renderToStaticMarkup(<RequestBody body={{ type: 'file', data: [] }} />)).toBe('');
  });
});
