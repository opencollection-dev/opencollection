/**
 * Shared request defaults applied at collection and folder level
 */

import type { Auth } from './auth';
import type { Scripts } from './scripts';
import type { Variable } from './variables';
import type { Action } from './actions';
import type { HttpRequestHeader, HttpRequestSettings } from '../requests/http';
import type { GraphQLRequestSettings } from '../requests/graphql';
import type { GrpcMetadata } from '../requests/grpc';

export interface RequestSettings {
  http?: HttpRequestSettings;
  graphql?: GraphQLRequestSettings;
}

export interface RequestDefaults {
  headers?: HttpRequestHeader[];
  metadata?: GrpcMetadata[];
  auth?: Auth;
  variables?: Variable[];
  actions?: Action[];
  scripts?: Scripts;
  settings?: RequestSettings;
}
