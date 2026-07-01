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

// Reason phrases for standard HTTP status codes — used to derive a label when the
// example doesn't store an explicit statusText (mirrors the request client).
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
const STATUS_CODE_PHRASES: Record<number, string> = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',
  103: 'Early Hints',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  208: 'Already Reported',
  226: 'IM Used',
  300: 'Multiple Choice',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  306: 'unused',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  418: "I'm a teapot",
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  510: 'Not Extended',
  511: 'Network Authentication Required'
};

/** The reason phrase for an HTTP status code (e.g. 404 -> "Not Found"), or undefined. */
export const statusCodePhrase = (status: number | undefined): string | undefined =>
  status === undefined ? undefined : STATUS_CODE_PHRASES[status];
