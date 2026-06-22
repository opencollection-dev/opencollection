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
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)}KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb < 10 ? 1 : 0)}MB`;
};

const RESPONSE_LANGUAGE: Record<string, string> = {
  json: 'json',
  xml: 'markup',
  html: 'markup',
  text: 'text',
  binary: 'text'
};

/** Map an example response body `type` to a Prism language. */
export const responseBodyLanguage = (type: string | undefined): string =>
  (type && RESPONSE_LANGUAGE[type]) || 'text';
