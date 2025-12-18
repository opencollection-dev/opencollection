/**
 * GraphQL request definitions
 */

import type { Auth } from '../common/auth';
import type { Action } from '../common/actions';
import type { Description } from '../common/description';
import type { Assertion } from '../common/assertions';
import type { Scripts } from '../common/scripts';
import type { Variable } from '../common/variables';
import type { Tag } from '../common/tags';
import type { HttpRequestHeader, HttpRequestParam } from './http';

export interface GraphQLBody {
  query?: string;
  variables?: string;
}

export interface GraphQLBodyVariant {
  title: string;
  selected?: boolean;
  body: GraphQLBody;
}

export interface GraphQLRequestSettings {
  encodeUrl?: boolean | 'inherit';
  timeout?: number | 'inherit';
  followRedirects?: boolean | 'inherit';
  maxRedirects?: number | 'inherit';
}

export interface GraphQLRequestInfo {
  name?: string;
  description?: Description;
  type?: 'graphql';
  seq?: number;
  tags?: Tag[];
}

export interface GraphQLRequestDetails {
  method?: string;
  url?: string;
  headers?: HttpRequestHeader[];
  params?: HttpRequestParam[];
  body?: GraphQLBody | GraphQLBodyVariant[];
}

export interface GraphQLRequestRuntime {
  variables?: Variable[];
  scripts?: Scripts;
  assertions?: Assertion[];
  actions?: Action[];
  auth?: Auth;
}

export interface GraphQLRequest {
  info?: GraphQLRequestInfo;
  graphql?: GraphQLRequestDetails;
  runtime?: GraphQLRequestRuntime;
  settings?: GraphQLRequestSettings;
  docs?: string;
}
