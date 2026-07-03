import { RESPONSE_LANGUAGE, RESPONSE_CONTENT_TYPE, STATUS_CODE_PHRASES } from './request';

/** Byte length of a response body (UTF-8 aware). */
export const computeBodySize = (data: string | undefined): number => {
  if (!data) return 0;
  try {
    return new TextEncoder().encode(data).length;
  } catch {
    return data.length;
  }
};

/**
 * Human-readable response size in KB (or MB for large bodies), e.g. "0.1KB",
 * "2.3KB", "1.1MB". KB is the smallest unit shown, matching the design.
 */
export const formatBytes = (bytes: number): string => {
  const format = (value: number): string => value.toFixed(value < 10 ? 1 : 0);
  const kb = bytes / 1024;
  // Compare the rounded value: 1048575 B rounds to "1024" KB, which must read as 1.0MB.
  if (Number(format(kb)) < 1024) return `${format(kb)}KB`;
  return `${format(bytes / 1024 / 1024)}MB`;
};

/** Map an example response body `type` to a Prism language. */
export const responseBodyLanguage = (type: string | undefined): string =>
  (type && RESPONSE_LANGUAGE[type]) || 'text';

/** The full MIME content type for an example response body `type` (falls back to text/plain). */
export const responseBodyContentType = (type: string | undefined): string =>
  (type && RESPONSE_CONTENT_TYPE[type]) || 'text/plain';

/** The reason phrase for an HTTP status code (e.g. 404 -> "Not Found"), or undefined. */
export const statusCodePhrase = (status: number | undefined): string | undefined =>
  status === undefined ? undefined : STATUS_CODE_PHRASES[status];
