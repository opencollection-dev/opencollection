import { describe, it, expect } from 'vitest';
import { getTreePathFromCollectionToItem } from './tree-utils';
import { getItemName } from '../../utils/schemaHelpers';

// Two requests that are byte-identical in name+method+url but live in different folders. Only the
// hydrated uuid tells them apart, so the ancestor walk must key on uuid — content matching would
// resolve whichever copy appears first in tree order and inherit the wrong folder's auth.
const request = (uuid: string): any => ({
  uuid,
  info: { type: 'http', name: 'Get User' },
  http: { method: 'GET', url: 'https://api.example.com/users' }
});
const folder = (uuid: string, name: string, child: any): any => ({
  uuid,
  info: { type: 'folder', name },
  items: [child]
});

describe('getTreePathFromCollectionToItem', () => {
  it('resolves the ancestor chain by uuid so duplicate requests map to their own folder', () => {
    const inA = request('req-a');
    const inB = request('req-b');
    const collection: any = { items: [folder('folder-a', 'A', inA), folder('folder-b', 'B', inB)] };

    // Content matching would return ['A'] for both copies; uuid keeps them distinct.
    expect(getTreePathFromCollectionToItem(collection, inA).map(getItemName)).toEqual(['A']);
    expect(getTreePathFromCollectionToItem(collection, inB).map(getItemName)).toEqual(['B']);
  });

  it('falls back to content matching when the target carries no uuid (unhydrated input)', () => {
    const req = { info: { type: 'http', name: 'Solo' }, http: { method: 'GET', url: 'https://x' } };
    const collection: any = { items: [{ info: { type: 'folder', name: 'F' }, items: [req] }] };
    expect(getTreePathFromCollectionToItem(collection, req as any).map(getItemName)).toEqual(['F']);
  });
});
