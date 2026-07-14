import { describe, it, expect } from 'vitest';
import {
  resolvePlaygroundTarget,
  PLAYGROUND_ENVIRONMENTS_SLUG,
  PLAYGROUND_COLLECTION_SLUG,
} from './resolvePlaygroundTarget';
import type { NavModel, NavEntry } from '../../../routing/types';
import type { Item as OpenCollectionItem } from '@opencollection/types/collection/item';

const item = (uuid: string): OpenCollectionItem => ({ uuid } as unknown as OpenCollectionItem);

const folderEntry: NavEntry = {
  slug: 'billing',
  type: 'folder',
  name: 'billing',
  item: item('folder-billing'),
  ancestors: [],
  depth: 0,
};
const requestEntry: NavEntry = {
  slug: 'billing/get-customers',
  type: 'request',
  name: 'get customers',
  item: item('req-get-customers'),
  ancestors: [{ name: 'billing', slug: 'billing' }],
  depth: 1,
  method: 'GET',
};
const model: NavModel = {
  ordered: [folderEntry, requestEntry],
  bySlug: new Map([
    [folderEntry.slug, folderEntry],
    [requestEntry.slug, requestEntry],
  ]),
};
const emptyModel: NavModel = { ordered: [], bySlug: new Map() };

describe('resolvePlaygroundTarget', () => {
  it('maps the ~environments token to the environments view (no item, no reveal)', () => {
    expect(resolvePlaygroundTarget(PLAYGROUND_ENVIRONMENTS_SLUG, model)).toEqual({
      view: 'environments',
      uuid: null,
      ancestors: [],
    });
  });

  it('maps the ~collection token to the collection-settings view', () => {
    expect(resolvePlaygroundTarget(PLAYGROUND_COLLECTION_SLUG, model)).toEqual({
      view: 'collection-settings',
      uuid: null,
      ancestors: [],
    });
  });

  it('maps a request slug to the playground view with its ancestor folders to reveal', () => {
    expect(resolvePlaygroundTarget('billing/get-customers', model)).toEqual({
      view: 'playground',
      uuid: 'req-get-customers',
      ancestors: ['folder-billing'],
    });
  });

  it('maps a folder slug to the folder-settings view', () => {
    expect(resolvePlaygroundTarget('billing', model)).toEqual({
      view: 'folder-settings',
      uuid: 'folder-billing',
      ancestors: [],
    });
  });

  it('returns null for an item slug the model cannot resolve yet (still hydrating)', () => {
    expect(resolvePlaygroundTarget('billing/get-customers', emptyModel)).toBeNull();
    expect(resolvePlaygroundTarget('does/not/exist', model)).toBeNull();
  });

  it('uses reserved ~-prefixed tokens that cannot collide with slugified item slugs', () => {
    expect(PLAYGROUND_ENVIRONMENTS_SLUG.startsWith('~')).toBe(true);
    expect(PLAYGROUND_COLLECTION_SLUG.startsWith('~')).toBe(true);
  });
});
