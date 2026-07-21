import { describe, it, expect } from 'vitest';
import reducer, {
  setPlaygroundCollection,
  updateCollectionEnvironments,
  updatePlaygroundItem,
  resetPlaygroundEnvironments,
  selectHydratedCollection,
  selectPlaygroundCollection,
  setViewMode,
  setSelectedExampleIndex,
  clearPlaygroundCollection,
  toggleFolderCollapse,
  expandFolders
} from './playground';
import { createOpenCollectionStore } from '../store';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import type { HttpRequest } from '@opencollection/types/requests/http';

const makeCollection = () =>
  ({
    info: { name: 'Test', version: '1.0.0' },
    config: {
      environments: [
        { name: 'Dev', variables: [{ name: 'a', value: '1' }, { name: 'b', value: '2' }] }
      ]
    },
    items: []
  }) as any;

const envVariables = (store: ReturnType<typeof createOpenCollectionStore>) =>
  selectHydratedCollection(store.getState())!.config!.environments![0].variables!;

describe('resetPlaygroundEnvironments', () => {
  it('restores the original environments after an edit', () => {
    const store = createOpenCollectionStore();
    store.dispatch(setPlaygroundCollection(makeCollection()));

    const edited = makeCollection();
    edited.config.environments[0].variables = [{ name: 'a', value: '1' }];
    store.dispatch(updateCollectionEnvironments(edited));
    expect(envVariables(store)).toHaveLength(1);

    store.dispatch(resetPlaygroundEnvironments());
    expect(envVariables(store).map((v: any) => v.name)).toEqual(['a', 'b']);
  });

  it('keeps the restore independent of later edits (cloned, not shared)', () => {
    const store = createOpenCollectionStore();
    store.dispatch(setPlaygroundCollection(makeCollection()));

    store.dispatch(resetPlaygroundEnvironments());
    const edited = makeCollection();
    edited.config.environments[0].variables = [];
    store.dispatch(updateCollectionEnvironments(edited));

    store.dispatch(resetPlaygroundEnvironments());
    expect(envVariables(store)).toHaveLength(2);
  });
});

describe('playground example view', () => {
  it('accepts the example view mode', () => {
    const s = reducer(undefined, setViewMode('example'));
    expect(s.viewMode).toBe('example');
  });

  it('sets and resets the selected example index', () => {
    const set = reducer(undefined, setSelectedExampleIndex(3));
    expect(set.selectedExampleIndex).toBe(3);
    const cleared = reducer(set, clearPlaygroundCollection());
    expect(cleared.selectedExampleIndex).toBeNull();
  });
});

describe('updatePlaygroundItem', () => {
  const withRequest = () =>
    ({
      info: { name: 'Test', version: '1.0.0' },
      items: [{ type: 'http', uuid: 'r1', name: 'Req', http: { url: 'old', method: 'GET' } }]
    }) as unknown as OpenCollectionCollection;

  const firstItem = (store: ReturnType<typeof createOpenCollectionStore>, select: typeof selectHydratedCollection) =>
    select(store.getState())!.items![0] as unknown as { uuid: string; http: { url: string } };

  it('updates the item in the hydrated collection (what the UI renders) as well as the base collection', () => {
    const store = createOpenCollectionStore();
    store.dispatch(setPlaygroundCollection(withRequest()));

    const updated = { type: 'http', uuid: 'r1', name: 'Req', http: { url: 'new', method: 'GET' } };
    store.dispatch(updatePlaygroundItem({ uuid: 'r1', item: updated as unknown as HttpRequest }));

    // The tree the UI reads must reflect the edit, with the uuid preserved so findItemByUuid resolves.
    expect(firstItem(store, selectHydratedCollection).http.url).toBe('new');
    expect(firstItem(store, selectHydratedCollection).uuid).toBe('r1');
    expect(firstItem(store, selectPlaygroundCollection).http.url).toBe('new');
  });
});

describe('playground folder collapse', () => {
  const withFolder = () =>
    ({
      info: { name: 'Test', version: '1.0.0' },
      items: [{ type: 'folder', uuid: 'f1', name: 'Folder', isCollapsed: false, items: [] }]
    }) as unknown as OpenCollectionCollection;
  const folder = (store: ReturnType<typeof createOpenCollectionStore>) =>
    selectHydratedCollection(store.getState())!.items![0] as { isCollapsed?: boolean };

  it('expandFolders reveals a collapsed folder', () => {
    const store = createOpenCollectionStore();
    store.dispatch(setPlaygroundCollection(withFolder()));
    store.dispatch(toggleFolderCollapse('f1'));
    expect(folder(store).isCollapsed).toBe(true);

    store.dispatch(expandFolders(['f1']));
    expect(folder(store).isCollapsed).toBe(false);
  });

  it('expandFolders keeps an already-open folder open (never collapses)', () => {
    const store = createOpenCollectionStore();
    store.dispatch(setPlaygroundCollection(withFolder()));
    store.dispatch(expandFolders(['f1']));
    expect(folder(store).isCollapsed).toBe(false);
  });
});
