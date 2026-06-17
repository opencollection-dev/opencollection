import { describe, it, expect } from 'vitest';
import type { OpenCollection } from '@opencollection/types';
import type { Item as OpenCollectionItem } from '@opencollection/types/collection/item';
import { countItems, getCollectionStats } from './collectionStats';

describe('countItems', () => {
  it('counts requests and folders recursively at every depth', () => {
    const items = [
      {
        type: 'folder',
        name: 'Auth',
        items: [
          { info: { type: 'http' }, http: {} },
          { info: { type: 'http' }, http: {} }
        ]
      },
      {
        type: 'folder',
        name: 'Hotels',
        items: [{ type: 'folder', name: 'Nested', items: [{ info: { type: 'http' }, http: {} }] }]
      },
      { info: { type: 'http' }, http: {} }
    ] as unknown as OpenCollectionItem[];

    // Folders: Auth, Hotels, Nested -> 3. Requests: 2 + 1 + 1 -> 4.
    expect(countItems(items)).toEqual({ requestCount: 4, folderCount: 3 });
  });

  it('returns zero counts for empty/missing items', () => {
    expect(countItems(undefined)).toEqual({ requestCount: 0, folderCount: 0 });
    expect(countItems([])).toEqual({ requestCount: 0, folderCount: 0 });
  });
});

describe('getCollectionStats', () => {
  it('includes the environment count from config', () => {
    const collection = {
      items: [{ info: { type: 'http' }, http: {} }],
      config: { environments: [{ name: 'Dev' }, { name: 'Prod' }] }
    } as unknown as OpenCollection;

    expect(getCollectionStats(collection)).toEqual({
      requestCount: 1,
      folderCount: 0,
      environmentCount: 2
    });
  });

  it('handles a null collection', () => {
    expect(getCollectionStats(null)).toEqual({ requestCount: 0, folderCount: 0, environmentCount: 0 });
  });
});
