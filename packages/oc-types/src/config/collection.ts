/**
 * Collection-level configuration types
 */

import type { ClientCertificate } from './certificates';
import type { Protobuf } from './protobuf';
import type { Proxy } from './proxy';
import type { Environment } from './environments';

export type ScriptExecutionFlow = 'sandwich' | 'sequential';

export interface CollectionScriptsConfig {
  flow?: ScriptExecutionFlow;
}

export interface CollectionConfig {
  environments?: Environment[];
  protobuf?: Protobuf;
  proxy?: Proxy;
  clientCertificates?: ClientCertificate[];
  scripts?: CollectionScriptsConfig;
}

