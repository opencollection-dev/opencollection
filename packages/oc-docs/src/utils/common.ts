import { customAlphabet } from 'nanoid';
import type { OpenCollection } from '@opencollection/types';
import type { Item } from '@opencollection/types/collection/item';
import type { BreadcrumbSegment } from '../ui/Breadcrumb/Breadcrumb';
import { getItemName } from './schemaHelpers';

// a customized version of nanoid without using _ and -
export const uuid = () => {
  const urlAlphabet = 'useandom26T198340PX75pxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict';
  const customNanoId = customAlphabet(urlAlphabet, 21);

  return customNanoId();
};

/**
 * Derives the brand-avatar initials from a collection name.
 * - Two or more words → first letter of the first two words ("Hotel Booking API" → "HB").
 * - Single word → just its first letter ("Echo" → "E").
 * - Empty / nullish → "" (caller decides the fallback).
 *
 * Pure + DOM-free so it can be unit tested directly.
 */
export const getInitials = (collectionName?: string | null): string => {
  const words = (collectionName ?? '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return '';
  }
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
};

export const statusToneColor = (status?: number): string => {
  if (status === undefined) return 'var(--text-muted)';
  if (status >= 200 && status < 300) return 'var(--oc-status-success-text)';
  if (status >= 400) return 'var(--oc-status-danger-text)';
  return 'var(--oc-status-info-text)';
};

export const COLLECTION_ROOT_CRUMB = '__collection_root__';

export const buildBreadcrumbSegments = (
  collection: OpenCollection | null | undefined,
  ancestry: Item[]
): BreadcrumbSegment[] => {
  const folderCrumbs = ancestry
    .map((folder) => ({ name: getItemName(folder) || 'Folder', uuid: (folder as { uuid?: string }).uuid || '' }))
    .filter((segment) => segment.uuid);
  return [{ name: collection?.info?.name || 'Overview', uuid: COLLECTION_ROOT_CRUMB }, ...folderCrumbs];
};
