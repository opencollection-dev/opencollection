/**
 * Collection-level configuration types
 */

import type { ClientCertificate } from './certificates';
import type { Protobuf } from './protobuf';
import type { Proxy } from './proxy';
import type { Environment } from './environments';

/**
 * Order in which pre/post-request scripts run across the collection → folder →
 * request hierarchy.
 *  - `sandwich` (default): each level wraps the request — post-response runs
 *    innermost→outermost (request → folder → collection).
 *  - `sequential`: post-response runs in the same order as pre-request
 *    (collection → folder → request).
 */
export type ScriptExecutionFlow = 'sandwich' | 'sequential';

export interface CollectionScriptsConfig {
  /** Script execution flow. Defaults to `sandwich` when omitted. */
  flow?: ScriptExecutionFlow;
}

export interface CollectionConfig {
  environments?: Environment[];
  protobuf?: Protobuf;
  proxy?: Proxy;
  clientCertificates?: ClientCertificate[];
  scripts?: CollectionScriptsConfig;
}

