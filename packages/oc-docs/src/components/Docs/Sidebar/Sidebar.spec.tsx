import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import { createOpenCollectionStore } from '../../../store/store';
import { setDocsCollection } from '../../../store/slices/docs';
import { setExampleHighlight } from '../../../store/slices/docsExamples';
import { getItemUuid } from '../../../utils/itemUtils';

const collection = {
  info: { name: 'C' },
  items: [
    { type: 'http', name: 'Login', method: 'POST', examples: [{ name: 'OK', response: { status: 200 } }] },
  ],
} as any;

const renderSidebar = () => {
  const store = createOpenCollectionStore();
  store.dispatch(setDocsCollection(collection));
  // The collection is hydrated with uuids on dispatch; read the request's uuid back.
  const requestUuid = getItemUuid((store.getState().docs.collection as any).items[0])!;
  store.dispatch(setExampleHighlight({ requestUuid, index: 0 }));
  const html = renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    </Provider>
  );
  return { html };
};

describe('Sidebar examples', () => {
  it('renders the highlighted example as an active sidebar row', () => {
    const { html } = renderSidebar();
    expect(html).toContain('sidebar-example');
    expect(html).toContain('OK');
    expect(html).toContain('active');
  });
});
