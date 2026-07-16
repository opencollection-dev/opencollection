import React from 'react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import PlaygroundBody from './PlaygroundBody';
import { createOpenCollectionStore } from '../../../store/store';
import { useRenderToDom } from '../../../hooks/useRenderToDom';
import {
  setPlaygroundCollection,
  setSelectedItemId,
  setSelectedExampleIndex,
  setViewMode
} from '../../../store/slices/playground';
import { getItemUuid } from '../../../utils/itemUtils';

const collection = {
  info: { name: 'C' },
  items: [
    {
      type: 'http',
      name: 'Login',
      method: 'POST',
      url: '/login',
      examples: [{ name: 'OK', response: { status: 200, body: { type: 'json', data: '{}' } } }]
    }
  ]
} as any;

describe('PlaygroundBody example view', () => {
  it('renders ExampleView when viewMode is example', () => {
    const store = createOpenCollectionStore();
    store.dispatch(setPlaygroundCollection(collection));
    const requestUuid = getItemUuid((store.getState().playground.hydratedCollection as any).items[0])!;
    store.dispatch(setSelectedItemId(requestUuid));
    store.dispatch(setSelectedExampleIndex(0));
    store.dispatch(setViewMode('example'));

    const ref = React.createRef<HTMLDivElement>();
    const root = useRenderToDom(
      <Provider store={store}>
        <MemoryRouter>
          <PlaygroundBody
            requestSlug={null}
            sidebarOpen={false}
            dock="modal"
            onCloseSidebar={() => {}}
            appliedSlugRef={ref as any}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(root.querySelector('[data-testid="example-view"]')).not.toBeNull();
  });
});
