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
