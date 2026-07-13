import React from 'react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import { createOpenCollectionStore } from '../../../store/store';
import { setDocsCollection } from '../../../store/slices/docs';
import { setExampleHighlight } from '../../../store/slices/docsExamples';
import { getItemUuid } from '../../../utils/itemUtils';
import { useRenderToDom } from '../../../hooks/useRenderToDom';
import { query } from '../../../test-utils/dom';

const collection = {
  info: { name: 'C' },
  items: [
    { type: 'http', name: 'Login', method: 'POST', examples: [{ name: 'OK', response: { status: 200 } }] },
  ],
} as any;

const buildSidebar = () => {
  const store = createOpenCollectionStore();
  store.dispatch(setDocsCollection(collection));
  // The collection is hydrated with uuids on dispatch; read the request's uuid back.
  const requestUuid = getItemUuid((store.getState().docs.collection as any).items[0])!;
  store.dispatch(setExampleHighlight({ requestUuid, index: 0 }));
  return (
    <Provider store={store}>
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    </Provider>
  );
};

describe('Sidebar examples', () => {
  it('renders the highlighted example as an active sidebar row', () => {
    const root = useRenderToDom(buildSidebar());
    const row = query(root, '[data-testid="sidebar-example"]');
    expect(row.text).toContain('OK');
    expect(row.getAttribute('class') ?? '').toContain('active');
  });
});
