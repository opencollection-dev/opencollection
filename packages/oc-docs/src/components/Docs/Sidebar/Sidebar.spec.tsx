import React from 'react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import { createOpenCollectionStore } from '../../../store/store';
import { setDocsCollection } from '../../../store/slices/docs';
import { useRenderToDom } from '../../../hooks/useRenderToDom';
import { query } from '../../../test-utils/dom';

const collection = {
  info: { name: 'C' },
  items: [
    { type: 'http', name: 'Login', method: 'POST', examples: [{ name: 'OK', response: { status: 200 } }] },
  ],
} as any;

// The highlight rides on the navigation entry's state, so render at the request
// route with { exampleIndex } in history state, exactly what a sidebar example
// click produces.
const buildSidebar = () => {
  const store = createOpenCollectionStore();
  store.dispatch(setDocsCollection(collection));
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: '/login', state: { exampleIndex: 0 } }]}>
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
