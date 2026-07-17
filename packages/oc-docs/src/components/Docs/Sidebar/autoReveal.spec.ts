import { describe, it, expect } from 'vitest';
import { computeAutoReveal } from './autoReveal';
import type { NavModel, NavEntry } from '../../../routing/types';
import type { Item as OpenCollectionItem } from '@opencollection/types/collection/item';

const item = (uuid: string): OpenCollectionItem => ({ uuid } as unknown as OpenCollectionItem);

// A collection where a request lives inside a folder: billing/ -> get-customers.
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

const loadedModel: NavModel = {
  ordered: [folderEntry, requestEntry],
  bySlug: new Map([
    [folderEntry.slug, folderEntry],
    [requestEntry.slug, requestEntry],
  ]),
};

// The model before the collection has hydrated (reload): nothing resolves yet.
const emptyModel: NavModel = { ordered: [], bySlug: new Map() };

describe('computeAutoReveal', () => {
  it('does NOT claim or expand when the model cannot resolve the slug yet', () => {
    // Reload: first run, collection still loading.
    expect(computeAutoReveal(null, 'billing/get-customers', emptyModel)).toEqual({
      claim: false,
      uuids: [],
    });
  });

  it('claims and expands the ancestor folders once the model resolves the slug', () => {
    expect(computeAutoReveal(null, 'billing/get-customers', loadedModel)).toEqual({
      claim: true,
      uuids: ['folder-billing'],
    });
  });

  it('does nothing when the item was already revealed, so a folder you collapsed by hand stays closed', () => {
    expect(
      computeAutoReveal('billing/get-customers', 'billing/get-customers', loadedModel)
    ).toEqual({ claim: false, uuids: [] });
  });

  it('opens the folder itself when a folder is the active item (here top-level, so just itself)', () => {
    expect(computeAutoReveal(null, 'billing', loadedModel)).toEqual({
      claim: true,
      uuids: ['folder-billing'],
    });
  });
});
