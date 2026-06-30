import { HTTPSnippet, type HarRequest } from '@mintlify/httpsnippet';
import type { HttpRequestBody, HttpRequestBodyVariant } from '@opencollection/types/requests/http';
import type { Auth } from '@opencollection/types/common/auth';
import { selectBodyVariant } from './request';
import { AUTH_TYPES, BODY_TYPES, CONTENT_TYPES } from '../constants';
import { templateVariableGlobalRegex } from './common';

export interface SnippetHeader {
  name: string;
  value: string;
}

export interface SnippetInput {
  method: string;
  url: string;
  headers?: SnippetHeader[];
  body?: HttpRequestBody | HttpRequestBodyVariant[];
  auth?: Auth;
}

/** The request body reduced to the shapes a code snippet needs to render. */
type NormalizedBody =
  | { kind: 'none' }
  | { kind: 'raw'; contentType: string; text: string }
  | { kind: 'urlencoded'; params: SnippetHeader[] }
  | { kind: 'multipart'; parts: { name: string; isFile: boolean; value: string }[] }
  | { kind: 'file'; contentType: string; filePath: string };

/** MIME type emitted for each raw (single-blob) body type. */
const RAW_BODY_MIME: Record<string, string> = {
  [BODY_TYPES.JSON]: CONTENT_TYPES.JSON,
  [BODY_TYPES.XML]: CONTENT_TYPES.XML,
  [BODY_TYPES.TEXT]: CONTENT_TYPES.TEXT,
  [BODY_TYPES.SPARQL]: CONTENT_TYPES.SPARQL
};

const toBase64 = (input: string): string => {
  try {
    if (typeof btoa === 'function') return btoa(input);
  } catch {
    /* non-latin1 — fall through */
  }
  const nodeBuffer = (globalThis as { Buffer?: { from: (s: string, e: string) => { toString: (e: string) => string } } })
    .Buffer;
  return nodeBuffer ? nodeBuffer.from(input, 'utf-8').toString('base64') : input;
};

/** Reduce the (possibly multi-variant) request body to a single NormalizedBody. */
const normalizeBody = (raw: SnippetInput['body']): NormalizedBody => {
  const { body } = selectBodyVariant(raw);
  if (!body || !body.type) return { kind: 'none' };
  switch (body.type) {
    case BODY_TYPES.JSON:
    case BODY_TYPES.XML:
    case BODY_TYPES.TEXT:
    case BODY_TYPES.SPARQL: {
      const text = typeof body.data === 'string' ? body.data.trim() : '';
      return text ? { kind: 'raw', contentType: RAW_BODY_MIME[body.type], text } : { kind: 'none' };
    }
    case BODY_TYPES.FORM_URLENCODED:
      return {
        kind: 'urlencoded',
        params: (body.data || []).filter((entry) => entry.disabled !== true).map((entry) => ({ name: entry.name, value: entry.value }))
      };
    case BODY_TYPES.MULTIPART_FORM:
      return {
        kind: 'multipart',
        parts: (body.data || [])
          .filter((entry) => entry.disabled !== true)
          .map((entry) => ({
            name: entry.name,
            isFile: entry.type === 'file',
            value: Array.isArray(entry.value) ? entry.value.join(',') : String(entry.value ?? '')
          }))
      };
    case BODY_TYPES.FILE: {
      const variants = body.data || [];
      const selected = variants.find((variant) => variant.selected) ?? variants[0];
      if (!selected || !selected.filePath) return { kind: 'none' };
      return { kind: 'file', contentType: selected.contentType || CONTENT_TYPES.OCTET_STREAM, filePath: selected.filePath };
    }
    default:
      return { kind: 'none' };
  }
};

/**
 * Express auth as request headers. Auth that can't become a deterministic header
 * (api-key in the query, awsv4/digest, basic with variables, …) returns a
 * `comment` instead, which the caller renders as a leading comment in the snippet.
 */
const authToHeaders = (auth: Auth | undefined): { headers: SnippetHeader[]; comment?: string } => {
  if (!auth || auth === 'inherit') return { headers: [] };
  switch (auth.type) {
    case AUTH_TYPES.BASIC: {
      const username = auth.username ?? '';
      const password = auth.password ?? '';
      if (`${username}${password}`.includes('{{')) {
        return { headers: [], comment: 'auth: Basic Auth — credentials use variables' };
      }
      return { headers: [{ name: 'Authorization', value: `Basic ${toBase64(`${username}:${password}`)}` }] };
    }
    case AUTH_TYPES.BEARER:
      return { headers: [{ name: 'Authorization', value: `Bearer ${auth.token ?? ''}` }] };
    case AUTH_TYPES.API_KEY:
      return auth.placement === 'query'
        ? { headers: [], comment: `auth: API Key — sent as query param "${auth.key ?? ''}"` }
        : { headers: [{ name: auth.key ?? 'X-API-Key', value: auth.value ?? '' }] };
    default:
      return { headers: [], comment: `auth: ${auth.type} — configure credentials` };
  }
};

/** Final header list for the request: explicit headers + auth headers + a body content-type. */
const collectHeaders = (
  input: SnippetInput,
  body: NormalizedBody
): { headers: SnippetHeader[]; comment?: string } => {
  const headers = [...(input.headers ?? [])];
  const auth = authToHeaders(input.auth);
  auth.headers.forEach((authHeader) => {
    const alreadyPresent = headers.some((existing) => existing.name.toLowerCase() === authHeader.name.toLowerCase());
    if (!alreadyPresent) headers.push(authHeader);
  });
  if ((body.kind === 'raw' || body.kind === 'file') && !headers.some((h) => h.name.toLowerCase() === 'content-type')) {
    headers.push({ name: 'Content-Type', value: body.contentType });
  }
  return { headers, comment: auth.comment };
};

/**
 * HTTPSnippet runs the URL through WHATWG parsing/encoding, which lowercases the
 * host and percent-encodes `{{var}}` tokens. The masker swaps each variable for a
 * lowercase, alphanumeric placeholder (which survives both transforms) before the
 * HAR is built; `unmask` restores the originals in the finished snippet so
 * templates stay copy-shareable.
 */
const createTemplateMasker = () => {
  const originalByPlaceholder = new Map<string, string>();
  const mask = (value: string): string =>
    value.replace(templateVariableGlobalRegex(), (variable) => {
      for (const [placeholder, original] of originalByPlaceholder) if (original === variable) return placeholder;
      // Trailing `x` terminates the index so e.g. `ocvar1x` is never a prefix of `ocvar11x`.
      const placeholder = `ocvar${originalByPlaceholder.size}x`;
      originalByPlaceholder.set(placeholder, variable);
      return placeholder;
    });
  const unmask = (value: string): string => {
    let restored = value;
    for (const [placeholder, original] of originalByPlaceholder) restored = restored.split(placeholder).join(original);
    return restored;
  };
  return { mask, unmask };
};

/** Map a NormalizedBody to a HAR `postData` block (template variables already masked). */
const toHarPostData = (body: NormalizedBody, mask: (s: string) => string): HarRequest['postData'] | undefined => {
  switch (body.kind) {
    case 'raw':
      return { mimeType: body.contentType, text: mask(body.text) };
    case 'urlencoded':
      return {
        mimeType: 'application/x-www-form-urlencoded',
        params: body.params.map((param) => ({ name: mask(param.name), value: mask(param.value) }))
      };
    case 'multipart':
      return {
        mimeType: 'multipart/form-data',
        params: body.parts.map((part) =>
          part.isFile
            ? { name: mask(part.name), fileName: mask(part.value) }
            : { name: mask(part.name), value: mask(part.value) }
        )
      };
    case 'file':
      // Single binary file body — show the file path as the payload (mirrors
      // bruno-enterprise-edition's buildPostData 'file' branch).
      return { mimeType: body.contentType, text: mask(body.filePath) };
    default:
      return undefined;
  }
};

/**
 * HTTPSnippet prepends `http://` to scheme-less URLs (treating the first path
 * segment as the host). Strip that synthetic origin so `{{baseUrl}}/x` (or a
 * relative `/x`) renders unchanged. No-op when the URL already has a scheme.
 */
const stripSyntheticOrigin = (snippet: string, originalUrl: string, maskedUrl: string): string => {
  if (/^https?:\/\//i.test(originalUrl.trim())) return snippet;
  const urlWithoutScheme = maskedUrl.replace(/^https?:\/\//i, '');
  const isRelative = urlWithoutScheme.startsWith('/');
  const host = urlWithoutScheme.replace(/^\//, '').split(/[/?#]/)[0];
  if (!host) return snippet;
  const originalOrigin = isRelative ? `/${host}` : host;
  return snippet.split(`http://${host}`).join(originalOrigin).split(`https://${host}`).join(originalOrigin);
};

/** Comment syntax per HTTPSnippet target (defaults to `# `). */
const COMMENT_PREFIX_BY_TARGET: Record<string, string> = { javascript: '// ' };

/**
 * Generate a code snippet for one HTTPSnippet target/client (e.g. shell/curl).
 * Pipeline: normalize body → mask templates → assemble HAR → HTTPSnippet.convert
 * → strip synthetic origin → unmask templates. Falls back to a plain `METHOD url`
 * line if HTTPSnippet ever throws, so the snippet panel never crashes the page.
 */
const generateSnippet = (input: SnippetInput, target: string, client: string): string => {
  const { mask, unmask } = createTemplateMasker();
  const body = normalizeBody(input.body);
  const { headers, comment } = collectHeaders(input, body);
  const withComment = (code: string): string =>
    comment ? `${COMMENT_PREFIX_BY_TARGET[target] ?? '# '}${comment}\n${code}` : code;

  try {
    const maskedUrl = mask(input.url);
    const postData = toHarPostData(body, mask);

    const harRequest = {
      method: (input.method || 'GET').toUpperCase(),
      url: maskedUrl,
      httpVersion: 'HTTP/1.1',
      cookies: [],
      headers: headers.map((header) => ({ name: mask(header.name), value: mask(header.value) })),
      queryString: [],
      headersSize: -1,
      bodySize: -1,
      ...(postData ? { postData } : {})
    } as HarRequest;

    const snippet = new HTTPSnippet(harRequest);
    const convert = snippet.convert.bind(snippet) as (t: string, c: string) => string | string[];
    const converted = convert(target, client);
    const snippetText = (Array.isArray(converted) ? converted[0] : converted) || '';
    return withComment(unmask(stripSyntheticOrigin(snippetText, input.url, maskedUrl)));
  } catch {
    // HTTPSnippet can throw on pathological URLs/bodies — degrade to a minimal
    // method + URL line (matches bruno-enterprise-edition's snippet-generator
    // try/catch fallback) so the snippet panel never crashes the page.
    return withComment(`${(input.method || 'GET').toUpperCase()} ${input.url}`);
  }
};

export const generateCurlCommand = (input: SnippetInput): string => generateSnippet(input, 'shell', 'curl');
export const generateJavaScriptCode = (input: SnippetInput): string => generateSnippet(input, 'javascript', 'fetch');
export const generatePythonCode = (input: SnippetInput): string => generateSnippet(input, 'python', 'requests');
