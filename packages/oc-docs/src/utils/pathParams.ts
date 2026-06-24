import type { HttpRequestParam } from '@opencollection/types/requests/http';

export const resolvePathAndQueryParams = (
  params: HttpRequestParam[] | undefined,
  url: string | undefined
): { path: HttpRequestParam[]; query: HttpRequestParam[] } => {
  const all = params ?? [];
  const declaredPath = all.filter((p) => p.type === 'path');
  const declaredNames = new Set(declaredPath.map((p) => p.name));
  const fromUrl = parsePathParamNames(url).filter((name) => !declaredNames.has(name));
  return {
    path: [...declaredPath, ...fromUrl.map((name): HttpRequestParam => ({ name, value: '', type: 'path' }))],
    query: all.filter((p) => p.type === 'query')
  };
};

/**
 * Extract the ordered, de-duplicated list of path-parameter names declared in a
 * URL using the `:name` segment syntax (e.g. `/posts/:postId` -> `['postId']`).
 *
 * Rules (mirroring the request-client behaviour):
 * - Only a segment that *starts* with `:` is a path param, so ports
 *   (`localhost:8081`) and protocols (`https://`) are never misread as params.
 * - The query string and fragment are ignored — only the path is scanned.
 * - The name is the identifier directly after the colon (`[A-Za-z0-9_-]+`), so
 *   `:postId.json` yields `postId` and a bare `:` yields nothing.
 * - Variable templates such as `{{host}}` are left untouched.
 * - Repeated names collapse to a single entry, preserving first-seen order.
 */
export const parsePathParamNames = (url: string | undefined | null): string[] => {
  if (!url || typeof url !== 'string') return [];

  // Only the path matters; drop the query string and fragment up-front.
  const pathPortion = url.split('?')[0].split('#')[0];

  const names: string[] = [];
  const seen = new Set<string>();

  for (const segment of pathPortion.split('/')) {
    // Fast reject before running the regex: must start with ':' and have more.
    if (segment.length < 2 || segment[0] !== ':') continue;

    const match = /^:([A-Za-z0-9_-]+)/.exec(segment);
    if (!match) continue;

    const name = match[1];
    if (!seen.has(name)) {
      seen.add(name);
      names.push(name);
    }
  }

  return names;
};

export const syncPathParams = (
  params: HttpRequestParam[] | undefined,
  url: string
): HttpRequestParam[] => {
  const existing = params ?? [];
  const pathNames = parsePathParamNames(url);
  const existingPath = existing.filter((p) => p?.type === 'path');

  // Nothing references path params on either side — leave the array as-is.
  if (pathNames.length === 0 && existingPath.length === 0) {
    return existing;
  }

  // Reuse existing path params (first match per name) to keep edited values.
  const existingByName = new Map<string, HttpRequestParam>();
  for (const p of existingPath) {
    if (!existingByName.has(p.name)) existingByName.set(p.name, p);
  }

  const nextPath: HttpRequestParam[] = pathNames.map(
    (name) => existingByName.get(name) ?? { name, value: '', type: 'path' as const }
  );

  // Reference-stable when the path set is identical (same entries, same order).
  const unchanged =
    existingPath.length === nextPath.length &&
    existingPath.every((p, i) => p === nextPath[i]);
  if (unchanged) {
    return existing;
  }

  // Keep query params (and their order); swap in the reconciled path set.
  const queryParams = existing.filter((p) => p?.type !== 'path');
  return [...queryParams, ...nextPath];
};

export const applyPathParams = (
  url: string | undefined | null,
  params: HttpRequestParam[] | undefined,
  options: { encode?: boolean } = {}
): string => {
  if (!url || typeof url !== 'string') return url ?? '';

  const { encode = true } = options;

  // Map enabled path params by name (first occurrence wins).
  const valueByName = new Map<string, string>();
  for (const p of params ?? []) {
    if (p?.type === 'path' && !p.disabled && p.name && !valueByName.has(p.name)) {
      valueByName.set(p.name, p.value ?? '');
    }
  }
  if (valueByName.size === 0) return url;

  // Substitute only within the path; preserve the query string / fragment.
  const sepIndex = url.search(/[?#]/);
  const pathPart = sepIndex === -1 ? url : url.slice(0, sepIndex);
  const rest = sepIndex === -1 ? '' : url.slice(sepIndex);

  const newPath = pathPart
    .split('/')
    .map((segment) => {
      if (segment.length < 2 || segment[0] !== ':') return segment;

      const match = /^:([A-Za-z0-9_-]+)(.*)$/.exec(segment);
      if (!match) return segment;

      const [, name, suffix] = match;
      if (!valueByName.has(name)) return segment;

      const value = valueByName.get(name) as string;
      return (encode ? encodeURIComponent(value) : value) + suffix;
    })
    .join('/');

  return newPath + rest;
};
