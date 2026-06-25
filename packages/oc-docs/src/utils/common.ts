import { customAlphabet } from 'nanoid';

// a customized version of nanoid without using _ and -
export const uuid = () => {
  const urlAlphabet = 'useandom26T198340PX75pxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict';
  const customNanoId = customAlphabet(urlAlphabet, 21);

  return customNanoId();
};

export const DEFAULT_COLLECTION_VERSION = 'v1.0.0';

export const formatCollectionVersion = (version?: string | number | null): string => {
  if (version === null || version === undefined) return DEFAULT_COLLECTION_VERSION;

  const raw = String(version).trim();
  if (!raw) return DEFAULT_COLLECTION_VERSION;

  // Drop an existing leading "v"/"V" so we never end up with "vv...".
  const core = raw.replace(/^v/i, '').trim();
  if (!core) return DEFAULT_COLLECTION_VERSION;

  const segments = core.split('.');
  const isNumeric = segments.every((segment) => /^\d+$/.test(segment));

  if (!isNumeric) {
    return `v${core}`;
  }

  while (segments.length < 3) {
    segments.push('0');
  }

  return `v${segments.join('.')}`;
};
