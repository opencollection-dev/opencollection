import { customAlphabet } from 'nanoid';
import type { OpenCollection } from '@opencollection/types';
import type { Item } from '@opencollection/types/collection/item';
import type { BreadcrumbSegment } from '../ui/Breadcrumb/Breadcrumb';
import { getItemName } from './schemaHelpers';
import { TEMPLATE_VARIABLE_BODY_PATTERN, TEMPLATE_VARIABLE_SOURCE_PATTERN } from '../constants';

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
  // Matches the request client's read-only status colouring: success below 300,
  // error at 300+ (redirects included — there is no separate 3xx tone).
  if (status < 300) return 'var(--oc-status-success-text)';
  return 'var(--oc-status-danger-text)';
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

/** True when the whole string is exactly one `{{var}}` token (anchored, non-global → stateless). */
export const isTemplateVariable = (value: string): boolean =>
  new RegExp(`^${TEMPLATE_VARIABLE_SOURCE_PATTERN}$`).test(value);

/** Fresh global regex capturing the WHOLE `{{var}}` token, for `String.split` tokenizing (delimiter kept). New instance per call → no shared `lastIndex`. */
export const templateVariableSplitRegex = (): RegExp => new RegExp(`(${TEMPLATE_VARIABLE_SOURCE_PATTERN})`, 'g');

/** Fresh global regex whose capture group 1 is the variable NAME, for `String.replace` masking/interpolation. New instance per call → stateless. */
export const templateVariableGlobalRegex = (): RegExp => new RegExp(`\\{\\{(${TEMPLATE_VARIABLE_BODY_PATTERN})\\}\\}`, 'g');
