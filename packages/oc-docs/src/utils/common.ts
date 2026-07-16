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

export function getValidClasses(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

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
  if (status < 300) return 'var(--oc-status-success-text)';
  // 3xx redirects are not errors — give them a neutral/info tone; reserve danger for 4xx/5xx.
  if (status < 400) return 'var(--oc-status-info-text)';
  return 'var(--oc-status-danger-text)';
};

// Tinted background token for a status badge, matching statusToneColor's tone.
export const statusToneBackground = (status?: number): string => {
  if (status === undefined) return 'transparent';
  if (status < 300) return 'var(--oc-status-success-background)';
  if (status < 400) return 'var(--oc-status-info-background)';
  return 'var(--oc-status-danger-background)';
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

const TEMPLATE_VARIABLE_EXACT_REGEX = new RegExp(`^${TEMPLATE_VARIABLE_SOURCE_PATTERN}$`);

/** True when the whole string is exactly one `{{var}}` token. */
export const isTemplateVariable = (value: string): boolean => TEMPLATE_VARIABLE_EXACT_REGEX.test(value);

/** Fresh global regex capturing the WHOLE `{{var}}` token, for `String.split` tokenizing (delimiter kept). New instance per call → no shared `lastIndex`. */
export const templateVariableSplitRegex = (): RegExp => new RegExp(`(${TEMPLATE_VARIABLE_SOURCE_PATTERN})`, 'g');

/** Fresh global regex whose capture group 1 is the variable NAME, for `String.replace` masking/interpolation. New instance per call → stateless. */
export const templateVariableGlobalRegex = (): RegExp => new RegExp(`\\{\\{(${TEMPLATE_VARIABLE_BODY_PATTERN})\\}\\}`, 'g');
