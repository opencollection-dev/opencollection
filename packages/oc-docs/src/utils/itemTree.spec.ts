import { describe, it, expect } from 'vitest';
import { findItemByUuid, getAncestorsByUuid } from './itemTree';

const collection: any = {
  items: [
    {
      uuid: 'f1',
      info: { type: 'folder', name: 'Auth' },
      items: [
        { uuid: 'r1', info: { type: 'http', name: 'Login' } },
        {
          uuid: 'f2',
          info: { type: 'folder', name: 'Sub' },
          items: [{ uuid: 'r2', info: { type: 'http', name: 'Deep' } }]
        }
      ]
    },
    { uuid: 'r3', info: { type: 'http', name: 'Top' } }
  ]
};

describe('itemTree', () => {
  it('finds an item by uuid, including nested ones', () => {
    expect((findItemByUuid(collection.items, 'r2') as any)?.info.name).toBe('Deep');
    expect((findItemByUuid(collection.items, 'r3') as any)?.info.name).toBe('Top');
    expect(findItemByUuid(collection.items, 'missing')).toBeNull();
  });

  it('returns folder ancestors from root to parent', () => {
    expect(getAncestorsByUuid(collection, 'r2').map((f: any) => f.info.name)).toEqual(['Auth', 'Sub']);
    expect(getAncestorsByUuid(collection, 'r1').map((f: any) => f.info.name)).toEqual(['Auth']);
    expect(getAncestorsByUuid(collection, 'r3')).toEqual([]);
  });
});
