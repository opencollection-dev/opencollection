/**
 * HTTP request types and shared authentication definitions
 */

import type { Auth } from '../common/auth';
import type { Action } from '../common/actions';
import type { Description } from '../common/description';
import type { Assertion } from '../common/assertions';
import type { Scripts } from '../common/scripts';
import type { Variable } from '../common/variables';
import type { Tag } from '../common/tags';

export interface HttpRequestHeader {
  name: string;
  value: string;
  description?: Description;
  disabled?: boolean;
}

export interface HttpResponseHeader {
  name: string;
  value: string;
}

export interface HttpRequestParam {
  name: string;
  value: string;
  description?: Description;
  type: 'query' | 'path';
  disabled?: boolean;
}

export interface RawBody {
  type: 'json' | 'text' | 'xml' | 'sparql';
  data: string;
}

export interface FormUrlEncodedEntry {
  name: string;
  value: string;
  description?: Description;
  disabled?: boolean;
}

export interface FormUrlEncodedBody {
  type: 'form-urlencoded';
  data: FormUrlEncodedEntry[];
}

export interface MultipartFormEntry {
  name: string;
  type: 'text' | 'file';
  value: string | string[];
  description?: Description;
  contentType?: string;
  disabled?: boolean;
}

export interface MultipartFormBody {
  type: 'multipart-form';
  data: MultipartFormEntry[];
}

export interface FileBodyVariant {
  filePath: string;
  contentType: string;
  selected: boolean;
}

/** @deprecated Use FileBodyVariant instead */
export type FileBodyEntry = FileBodyVariant;

export interface FileBody {
  type: 'file';
  data: FileBodyVariant[];
}

export type HttpRequestBody = RawBody | FormUrlEncodedBody | MultipartFormBody | FileBody;

export interface HttpRequestBodyVariant {
  title: string;
  selected?: boolean;
  body: HttpRequestBody;
}

export interface HttpRequestSettings {
  encodeUrl?: boolean | 'inherit';
  timeout?: number | 'inherit';
  followRedirects?: boolean | 'inherit';
  maxRedirects?: number | 'inherit';
}

export interface HttpRequestExampleRequest {
  url?: string;
  method?: string;
  headers?: HttpRequestHeader[];
  params?: HttpRequestParam[];
  body?: HttpRequestBody;
}

export interface HttpRequestExampleResponseBody {
  type: 'json' | 'text' | 'xml' | 'html' | 'binary';
  data: string;
}

export interface HttpRequestExampleResponse {
  status?: number;
  statusText?: string;
  headers?: HttpResponseHeader[];
  body?: HttpRequestExampleResponseBody;
}

export interface HttpRequestExample {
  name?: string;
  description?: Description;
  request?: HttpRequestExampleRequest;
  response?: HttpRequestExampleResponse;
}

export interface HttpRequestInfo {
  name?: string;
  description?: Description;
  type?: 'http';
  seq?: number;
  tags?: Tag[];
}

export interface HttpRequestDetails {
  method?: string;
  url?: string;
  headers?: HttpRequestHeader[];
  params?: HttpRequestParam[];
  body?: HttpRequestBody | HttpRequestBodyVariant[];
  auth?: Auth;
}

export interface HttpRequestRuntime {
  variables?: Variable[];
  scripts?: Scripts;
  assertions?: Assertion[];
  actions?: Action[];
}

export interface HttpRequest {
  info?: HttpRequestInfo;
  http?: HttpRequestDetails;
  runtime?: HttpRequestRuntime;
  settings?: HttpRequestSettings;
  examples?: HttpRequestExample[];
  docs?: string;
}

export type { Auth, AuthApiKey, AuthAwsV4, AuthBasic, AuthBearer, AuthDigest, AuthNTLM, AuthWsse } from '../common/auth';
