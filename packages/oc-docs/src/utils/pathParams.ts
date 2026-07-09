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

/**
 * Build the URL that is actually sent: substitute `:name` path params into the
 * path and append enabled query params to the query string.
 *
 * - Path params delegate to {@link applyPathParams} (disabled or unmatched ones
 *   stay literal).
 * - Only enabled query params are appended; a param replaces the same-named key
 *   already in the URL, and URL-only keys are kept.
 * - With no applicable params the URL is returned unchanged.
 */
export const buildRequestUrl = (
  url: string | undefined | null,
  params: HttpRequestParam[] | undefined,
  options: { encode?: boolean } = {}
): string => {
  if (!url || typeof url !== 'string') return url ?? '';

  const { encode = true } = options;
  const withPath = applyPathParams(url, params, { encode });

  const queryParams = (params ?? []).filter((p) => p?.type === 'query' && !p.disabled && p.name);
  if (queryParams.length === 0) return withPath;


  const hashIndex = withPath.indexOf('#');
  const fragment = hashIndex === -1 ? '' : withPath.slice(hashIndex);
  const beforeHash = hashIndex === -1 ? withPath : withPath.slice(0, hashIndex);
  const qIndex = beforeHash.indexOf('?');
  const base = qIndex === -1 ? beforeHash : beforeHash.slice(0, qIndex);
  const existingQuery = qIndex === -1 ? '' : beforeHash.slice(qIndex + 1);

  const arrayNames = new Set(queryParams.map((p) => p.name));
  const pairs: string[] = [];

  // Keep URL-only keys;
  for (const pair of existingQuery.split('&')) {
    if (!pair) continue;
    let key = pair.split('=')[0].replace(/\+/g, ' ');
    try {
      key = decodeURIComponent(key);
    } catch {
      // leave a malformed key as-is
    }
    if (!arrayNames.has(key)) pairs.push(pair);
  }

  for (const p of queryParams) {
    const name = encode ? encodeURIComponent(p.name) : p.name;
    const value = encode ? encodeURIComponent(p.value ?? '') : p.value ?? '';
    pairs.push(`${name}=${value}`);
  }

  const queryString = pairs.join('&');
  return `${base}${queryString ? `?${queryString}` : ''}${fragment}`;
};

const parseUrlQueryParams = (url: string | undefined | null): { name: string; value: string }[] => {
  if (!url || typeof url !== 'string') return [];

  const beforeHash = url.split('#')[0];
  const qIndex = beforeHash.indexOf('?');
  if (qIndex === -1) return [];

  const pairs: { name: string; value: string }[] = [];
  for (const part of beforeHash.slice(qIndex + 1).split('&')) {
    if (!part) continue;
    const eq = part.indexOf('=');
    const name = eq === -1 ? part : part.slice(0, eq);
    const value = eq === -1 ? '' : part.slice(eq + 1);
    if (name) pairs.push({ name, value });
  }
  return pairs;
};


export const syncQueryParams = (
  params: HttpRequestParam[] | undefined,
  url: string
): HttpRequestParam[] => {
  const existing = params ?? [];
  const urlQuery = parseUrlQueryParams(url);
  const existingQuery = existing.filter((p) => p?.type !== 'path');

  if (urlQuery.length === 0 && existingQuery.length === 0) {
    return existing;
  }

  const existingByName = new Map<string, HttpRequestParam>();
  for (const p of existingQuery) {
    if (p?.name && !p.disabled && !existingByName.has(p.name)) existingByName.set(p.name, p);
  }

  const fromUrl: HttpRequestParam[] = urlQuery.map((q) => {
    const prev = existingByName.get(q.name);
    if (!prev) return { name: q.name, value: q.value, type: 'query' as const };
    if (prev.value === q.value) return prev;
    return { ...prev, value: q.value };
  });
  const keptDisabled = existingQuery.filter((p) => p?.disabled);
  const nextQuery = [...fromUrl, ...keptDisabled];

  const unchanged =
    existingQuery.length === nextQuery.length &&
    existingQuery.every((p, i) => p === nextQuery[i]);
  if (unchanged) {
    return existing;
  }

  const pathParams = existing.filter((p) => p?.type === 'path');
  return [...nextQuery, ...pathParams];
};


export const setUrlQueryParams = (
  url: string | undefined | null,
  params: HttpRequestParam[] | undefined
): string => {
  if (!url || typeof url !== 'string') return url ?? '';

  const enabled = (params ?? []).filter((p) => p?.type !== 'path' && !p.disabled && p.name);

  const hashIndex = url.indexOf('#');
  const fragment = hashIndex === -1 ? '' : url.slice(hashIndex);
  const beforeHash = hashIndex === -1 ? url : url.slice(0, hashIndex);
  const qIndex = beforeHash.indexOf('?');
  const base = qIndex === -1 ? beforeHash : beforeHash.slice(0, qIndex);

  const queryString = enabled.map((p) => `${p.name}=${p.value ?? ''}`).join('&');

  return `${base}${queryString ? `?${queryString}` : ''}${fragment}`;
};
