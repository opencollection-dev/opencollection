export const BODY_TYPES = {
  JSON: 'json',
  XML: 'xml',
  TEXT: 'text',
  HTML: 'html',
  SPARQL: 'sparql',
  FORM_URLENCODED: 'form-urlencoded',
  MULTIPART_FORM: 'multipart-form',
  FILE: 'file',
  BINARY: 'binary'
} as const;

export type BodyType = (typeof BODY_TYPES)[keyof typeof BODY_TYPES];

export const CONTENT_TYPES = {
  JSON: 'application/json',
  XML: 'application/xml',
  TEXT: 'text/plain',
  HTML: 'text/html',
  SPARQL: 'application/sparql-query',
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
  MULTIPART_FORM: 'multipart/form-data',
  OCTET_STREAM: 'application/octet-stream'
} as const;

export type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];

/** Short badge labels for non-HTTP protocols, keyed by item type (GraphQL,
 *  gRPC, WebSocket). HTTP requests use their method as the badge instead. */
export const PROTOCOL_BADGE_LABELS: Record<string, string> = {
  graphql: 'GQL',
  grpc: 'GRPC',
  websocket: 'WS'
};
