/**
 * Single source of truth mapping request kinds (HTTP methods and non-HTTP
 * protocols) to their theme-token CSS vars. Used by every place that colours a
 * method or protocol label (Item badge, sidebar tree, drawer drag bar,
 * playground query bar) so the mapping can't drift between components.
 */
export const methodColorVars: Record<string, string> = {
  GET: 'var(--oc-request-methods-get)',
  POST: 'var(--oc-request-methods-post)',
  PUT: 'var(--oc-request-methods-put)',
  PATCH: 'var(--oc-request-methods-patch)',
  DELETE: 'var(--oc-request-methods-delete)',
  HEAD: 'var(--oc-request-methods-head)',
  OPTIONS: 'var(--oc-request-methods-options)',
  // Currently not supported in OC Docs
  // commented as part of BRU-3833
  // GRAPHQL: 'var(--oc-request-gql)',
  // GQL: 'var(--oc-request-gql)',
  // GRPC: 'var(--oc-request-grpc)',
  // WEBSOCKET: 'var(--oc-request-ws)',
  // WS: 'var(--oc-request-ws)',
};

/** Method colour var, case-insensitive, with a muted fallback for unknown methods. */
export const getMethodColorVar = (method?: string): string =>
  (method && methodColorVars[method.toUpperCase()]) || 'var(--oc-colors-text-muted)';
