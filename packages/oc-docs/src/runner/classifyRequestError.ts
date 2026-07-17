/**
 * Classifies a failed try-it request (one that never produced an HTTP response)
 * into a user-facing title + message.
 *
 * Browser `fetch` collapses CORS, DNS, connection-refused, offline, and TLS into
 * one opaque failure with no detail — the real cause lives only in devtools and
 * is unreadable by the page. So we classify from the REQUEST CONTEXT (did it time
 * out, the page vs target scheme, and same-origin vs cross-origin / file) rather
 * than from the error text.
 *
 * Origin (scheme + host + port), not site, is what decides cross-origin: a request
 * from https://docs.example.com to https://api.example.com is cross-origin and
 * triggers CORS even though both share the site example.com. Comparing by origin
 * matches how the browser actually enforces CORS.
 *
 * NOTE: 4xx/5xx responses are NOT failures — they never reach this function.
 */

export type RequestErrorType =
  | 'timeout'
  | 'invalid-method'
  | 'mixed-content'
  | 'browser-blocked'
  | 'unreachable'
  | 'unknown';

export interface ClassifiedRequestError {
  type: RequestErrorType;
  title: string;
  message: string;
}

interface ClassifyOptions {
  /** The request timeout in milliseconds (reserved for future use / parity). */
  timeoutMs?: number;
  /** The fully-resolved request URL passed to fetch (after variable interpolation). */
  requestUrl?: string;
  /** The page URL the docs are running on, typically window.location.href. */
  pageUrl?: string;
}

export const DEFAULT_TIMEOUT_MS = 30000;

/**
 * `AbortSignal.timeout()` rejects with a DOMException named `TimeoutError`.
 * A manual `AbortController.abort()` rejects with one named `AbortError`.
 * Older engines surface neither name cleanly, so we also sniff the message.
 */
const isTimeoutError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  if (error.name === 'TimeoutError' || error.name === 'AbortError') return true;
  const msg = error.message.toLowerCase();
  return msg.includes('timed out') || msg.includes('timeout');
};

/**
 * The browser's opaque network failure. `fetch` throws a `TypeError` whose
 * message is "Failed to fetch" (Chrome) / "NetworkError when attempting to
 * fetch resource" (Firefox) / "Load failed" (Safari).
 */
const isOpaqueFetchFailure = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  if (error.name !== 'TypeError') return false;
  const msg = error.message.toLowerCase();
  return msg.includes('fetch') || msg.includes('load failed') || msg.includes('networkerror');
};

/**
 * `fetch` rejects with a `TypeError` when the method is an invalid token
 * ("'FOO BAR' is not a valid HTTP method") or a forbidden verb the browser
 * refuses to send (CONNECT/TRACE/TRACK -> "'CONNECT' HTTP method is
 * unsupported"). These carry "fetch" in the message on Chrome, so this must run
 * before isOpaqueFetchFailure to avoid being misread as a network/CORS failure.
 */
const isInvalidMethodError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  if (error.name !== 'TypeError') return false;
  const msg = error.message.toLowerCase();
  return msg.includes('is not a valid http method') || msg.includes('http method is unsupported');
};

const safeParseUrl = (url?: string): URL | null => {
  if (!url) return null;
  try {
    return new URL(url);
  } catch {
    return null;
  }
};

const TIMEOUT: ClassifiedRequestError = {
  type: 'timeout',
  title: 'Request timed out',
  message: "Request timed out. The server didn't respond in time."
};

const INVALID_METHOD: ClassifiedRequestError = {
  type: 'invalid-method',
  title: 'Invalid HTTP method',
  message:
    "The HTTP method isn't accepted by the browser. Some verbs (like CONNECT, TRACE and " +
    'TRACK) and methods with spaces or special characters are rejected. Try it in the ' +
    'Bruno desktop app.'
};

const MIXED_CONTENT: ClassifiedRequestError = {
  type: 'mixed-content',
  title: 'Request blocked',
  message:
    'Request blocked: this page is secure (https) but the URL is insecure (http). ' +
    'Use an https URL, or run it from the Bruno desktop app.'
};

const BROWSER_BLOCKED: ClassifiedRequestError = {
  type: 'browser-blocked',
  title: 'Request blocked',
  message:
    "Request blocked by your browser, usually CORS: the API didn't allow requests " +
    'from this page. Try it in the Bruno desktop app.'
};

const UNREACHABLE: ClassifiedRequestError = {
  type: 'unreachable',
  title: "Couldn't reach the server",
  message: "Couldn't reach the server. It may be down, or the URL may be wrong."
};

export const classifyRequestError = (
  error: unknown,
  options: ClassifyOptions = {}
): ClassifiedRequestError => {
  if (isTimeoutError(error)) {
    return TIMEOUT;
  }

  if (isInvalidMethodError(error)) {
    return INVALID_METHOD;
  }

  if (isOpaqueFetchFailure(error)) {
    const target = safeParseUrl(options.requestUrl);
    const page = safeParseUrl(options.pageUrl);

    // Without a parseable target URL we can't reason about scheme/origin, so we
    // fall through to the underlying message rather than guess.
    if (target && page) {
      // Secure page requesting an insecure URL -> the browser blocks it as mixed content.
      if (page.protocol === 'https:' && target.protocol === 'http:') {
        return MIXED_CONTENT;
      }

      // Docs opened from a file have origin "null"; any cross-origin request is
      // subject to CORS. Same-origin failures can't be CORS, so the server is
      // unreachable (down, or wrong URL).
      const openedFromFile = page.origin === 'null' || page.protocol === 'file:';
      if (openedFromFile || target.origin !== page.origin) {
        return BROWSER_BLOCKED;
      }

      return UNREACHABLE;
    }
  }

  // Anything else (or an unparseable URL): surface the underlying error message.
  const rawMessage =
    error instanceof Error && error.message ? error.message : 'The request could not be completed.';
  return {
    type: 'unknown',
    title: "Couldn't complete the request",
    message: rawMessage
  };
};
