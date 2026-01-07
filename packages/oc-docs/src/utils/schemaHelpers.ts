/**
 * Helper utilities for working with the new OpenCollection schema structure.
 * 
 * The new schema groups request properties into:
 * - info: name, type, seq, description, tags
 * - http/graphql/grpc/websocket: protocol-specific details (method, url, headers, body, params)
 * - runtime: auth, variables, assertions, scripts
 * - settings: timeout, followRedirects, etc.
 * - docs: documentation at root level
 * 
 * Scripts are now an array of { type, code } instead of { preRequest, postResponse, tests, hooks }
 */

import type { Item as OpenCollectionItem, Folder } from '@opencollection/types/collection/item';
import type { HttpRequest, HttpRequestHeader } from '@opencollection/types/requests/http';
import type { GraphQLRequest } from '@opencollection/types/requests/graphql';
import type { GrpcRequest } from '@opencollection/types/requests/grpc';
import type { WebSocketRequest } from '@opencollection/types/requests/websocket';
import type { Script, Scripts, ScriptType } from '@opencollection/types/common/scripts';

type RequestItem = HttpRequest | GraphQLRequest | GrpcRequest | WebSocketRequest;

/**
 * Get the type of an item (from info block or root for backwards compatibility)
 */
export const getItemType = (item: OpenCollectionItem | null | undefined): string | undefined => {
  if (!item) return undefined;
  
  // New schema: type is in info block
  if ('info' in item && item.info?.type) {
    return item.info.type;
  }
  
  // Backwards compatibility: type at root level
  if ('type' in item) {
    return (item as any).type;
  }
  
  return undefined;
};

/**
 * Get the name of an item (from info block or root for backwards compatibility)
 */
export const getItemName = (item: OpenCollectionItem | null | undefined): string | undefined => {
  if (!item) return undefined;
  
  // New schema: name is in info block
  if ('info' in item && (item as any).info?.name) {
    return (item as any).info.name;
  }
  
  // Backwards compatibility: name at root level
  if ('name' in item) {
    return (item as any).name;
  }
  
  return undefined;
};

/**
 * Get the sequence number of an item
 */
export const getItemSeq = (item: OpenCollectionItem | null | undefined): number | undefined => {
  if (!item) return undefined;
  
  if ('info' in item && (item as any).info?.seq !== undefined) {
    return (item as any).info.seq;
  }
  
  if ('seq' in item) {
    return (item as any).seq;
  }
  
  return undefined;
};

/**
 * Check if an item is a folder
 */
export const isFolder = (item: OpenCollectionItem | null | undefined): item is Folder => {
  return getItemType(item) === 'folder';
};

/**
 * Check if an item is an HTTP request
 */
export const isHttpRequest = (item: OpenCollectionItem | null | undefined): item is HttpRequest => {
  return getItemType(item) === 'http';
};

/**
 * Check if an item is a GraphQL request
 */
export const isGraphQLRequest = (item: OpenCollectionItem | null | undefined): item is GraphQLRequest => {
  return getItemType(item) === 'graphql';
};

/**
 * Check if an item is a gRPC request
 */
export const isGrpcRequest = (item: OpenCollectionItem | null | undefined): item is GrpcRequest => {
  return getItemType(item) === 'grpc';
};

/**
 * Check if an item is a WebSocket request
 */
export const isWebSocketRequest = (item: OpenCollectionItem | null | undefined): item is WebSocketRequest => {
  return getItemType(item) === 'websocket';
};

/**
 * Get HTTP method from a request (from http block or root for backwards compatibility)
 */
export const getHttpMethod = (item: HttpRequest | null | undefined): string => {
  if (!item) return 'GET';
  
  // New schema: method in http block
  if (item.http?.method) {
    return item.http.method;
  }
  
  // Backwards compatibility: method at root level
  if ('method' in item && (item as any).method) {
    return (item as any).method;
  }
  
  return 'GET';
};

/**
 * Get URL from a request (from http/graphql/grpc/websocket block or root)
 */
export const getRequestUrl = (item: RequestItem | null | undefined): string => {
  if (!item) return '';
  
  // New schema: url in protocol block
  if ('http' in item && item.http?.url) {
    return item.http.url;
  }
  if ('graphql' in item && (item as GraphQLRequest).graphql?.url) {
    return (item as GraphQLRequest).graphql!.url!;
  }
  if ('grpc' in item && (item as GrpcRequest).grpc?.url) {
    return (item as GrpcRequest).grpc!.url!;
  }
  if ('websocket' in item && (item as WebSocketRequest).websocket?.url) {
    return (item as WebSocketRequest).websocket!.url!;
  }
  
  // Backwards compatibility: url at root level
  if ('url' in item) {
    return (item as any).url || '';
  }
  
  return '';
};

/**
 * Get headers from an HTTP request (from http block or root)
 */
export const getHttpHeaders = (item: HttpRequest | null | undefined): HttpRequestHeader[] => {
  if (!item) return [];
  
  // New schema: headers in http block
  if (item.http?.headers) {
    return item.http.headers;
  }
  
  // Backwards compatibility: headers at root level
  if ('headers' in item && Array.isArray((item as any).headers)) {
    return (item as any).headers;
  }
  
  return [];
};

/**
 * Get body from an HTTP request (from http block or root)
 */
export const getHttpBody = (item: HttpRequest | null | undefined): HttpRequest['http'] extends { body?: infer B } ? B : any => {
  if (!item) return undefined;
  
  // New schema: body in http block
  if (item.http?.body) {
    return item.http.body;
  }
  
  // Backwards compatibility: body at root level
  if ('body' in item) {
    return (item as any).body;
  }
  
  return undefined;
};

/**
 * Get params from an HTTP request (from http block or root)
 */
export const getHttpParams = (item: HttpRequest | null | undefined): HttpRequest['http'] extends { params?: infer P } ? P : any => {
  if (!item) return [];
  
  // New schema: params in http block
  if (item.http?.params) {
    return item.http.params;
  }
  
  // Backwards compatibility: params at root level
  if ('params' in item && Array.isArray((item as any).params)) {
    return (item as any).params;
  }
  
  return [];
};

/**
 * Get auth from a request (from runtime block or root)
 */
export const getRequestAuth = (item: RequestItem | null | undefined): any => {
  if (!item) return undefined;
  
  // New schema: auth in runtime block
  if ('runtime' in item && (item as any).runtime?.auth) {
    return (item as any).runtime.auth;
  }
  
  // Backwards compatibility: auth at root level
  if ('auth' in item) {
    return (item as any).auth;
  }
  
  return undefined;
};

/**
 * Get variables from a request (from runtime block or root)
 */
export const getRequestVariables = (item: RequestItem | null | undefined): any[] => {
  if (!item) return [];
  
  // New schema: variables in runtime block
  if ('runtime' in item && (item as any).runtime?.variables) {
    return (item as any).runtime.variables;
  }
  
  // Backwards compatibility: variables at root level
  if ('variables' in item && Array.isArray((item as any).variables)) {
    return (item as any).variables;
  }
  
  return [];
};

/**
 * Get assertions from a request (from runtime block or root)
 */
export const getRequestAssertions = (item: RequestItem | null | undefined): any[] => {
  if (!item) return [];
  
  // New schema: assertions in runtime block
  if ('runtime' in item && (item as any).runtime?.assertions) {
    return (item as any).runtime.assertions;
  }
  
  // Backwards compatibility: assertions at root level
  if ('assertions' in item && Array.isArray((item as any).assertions)) {
    return (item as any).assertions;
  }
  
  return [];
};

/**
 * Get scripts from a request (from runtime block or root)
 * Returns the scripts in array format
 */
export const getRequestScripts = (item: RequestItem | null | undefined): Scripts => {
  if (!item) return [];
  
  // New schema: scripts in runtime block
  if ('runtime' in item && (item as any).runtime?.scripts) {
    const scripts = (item as any).runtime.scripts;
    // If already an array, return as-is
    if (Array.isArray(scripts)) {
      return scripts;
    }
    // Convert old format to new array format
    return scriptsObjectToArray(scripts);
  }
  
  // Backwards compatibility: scripts at root level
  if ('scripts' in item) {
    const scripts = (item as any).scripts;
    if (Array.isArray(scripts)) {
      return scripts;
    }
    return scriptsObjectToArray(scripts);
  }
  
  return [];
};

/**
 * Convert old scripts object format to new array format
 */
export const scriptsObjectToArray = (scripts: ScriptsObject | Record<string, string | undefined> | null | undefined): Script[] => {
  if (!scripts) return [];
  
  const result: Script[] = [];
  
  // Map old property names to new type names
  const typeMap: Record<string, ScriptType> = {
    preRequest: 'before-request',
    postResponse: 'after-response',
    tests: 'tests',
    hooks: 'hooks'
  };
  
  for (const [key, code] of Object.entries(scripts)) {
    if (code && typeof code === 'string') {
      const type = typeMap[key] || (key as ScriptType);
      result.push({ type, code });
    }
  }
  
  return result;
};

/**
 * Represents scripts in object format for UI compatibility
 */
export interface ScriptsObject {
  preRequest?: string;
  postResponse?: string;
  tests?: string;
  hooks?: string;
}

/**
 * Convert new scripts array format to old object format
 * Useful for components that still expect the old format
 */
export const scriptsArrayToObject = (scripts: Scripts | null | undefined): ScriptsObject => {
  if (!scripts || !Array.isArray(scripts)) {
    // If it's already an object, return as-is with type mapping
    if (scripts && typeof scripts === 'object') {
      return scripts as ScriptsObject;
    }
    return {};
  }
  
  const result: ScriptsObject = {};
  
  // Map new type names to old property names for UI compatibility
  const typeMap: Record<ScriptType, keyof ScriptsObject> = {
    'before-request': 'preRequest',
    'after-response': 'postResponse',
    'tests': 'tests',
    'hooks': 'hooks'
  };
  
  for (const script of scripts) {
    if (script.type && script.code) {
      const key = typeMap[script.type] || script.type;
      result[key as keyof ScriptsObject] = script.code;
    }
  }
  
  return result;
};

/**
 * Get a specific script by type
 */
export const getScriptByType = (scripts: Scripts | null | undefined, type: ScriptType): string | undefined => {
  if (!scripts) return undefined;
  
  if (Array.isArray(scripts)) {
    const script = scripts.find(s => s.type === type);
    return script?.code;
  }
  
  // Handle old object format
  const typeMap: Record<ScriptType, string> = {
    'before-request': 'preRequest',
    'after-response': 'postResponse',
    'tests': 'tests',
    'hooks': 'hooks'
  };
  
  return (scripts as any)[typeMap[type]];
};

/**
 * Get pre-request script from scripts (handles both array and object format)
 */
export const getPreRequestScript = (scripts: Scripts | Record<string, string> | null | undefined): string | undefined => {
  if (!scripts) return undefined;
  
  if (Array.isArray(scripts)) {
    return getScriptByType(scripts, 'before-request');
  }
  
  return (scripts as any).preRequest;
};

/**
 * Get post-response script from scripts (handles both array and object format)
 */
export const getPostResponseScript = (scripts: Scripts | Record<string, string> | null | undefined): string | undefined => {
  if (!scripts) return undefined;
  
  if (Array.isArray(scripts)) {
    return getScriptByType(scripts, 'after-response');
  }
  
  return (scripts as any).postResponse;
};

/**
 * Get tests script from scripts (handles both array and object format)
 */
export const getTestsScript = (scripts: Scripts | Record<string, string> | null | undefined): string | undefined => {
  if (!scripts) return undefined;
  
  if (Array.isArray(scripts)) {
    return getScriptByType(scripts, 'tests');
  }
  
  return (scripts as any).tests;
};

/**
 * Get docs from an item (at root level in new schema)
 * Handles both string format and object format { content, type }
 */
export const getItemDocs = (item: OpenCollectionItem | null | undefined): string | undefined => {
  if (!item) return undefined;

  if ('docs' in item) {
    const docs = (item as any).docs;

    // Handle object format: { content: string, type: string }
    if (docs && typeof docs === 'object' && 'content' in docs) {
      return docs.content;
    }

    // Handle string format
    if (typeof docs === 'string') {
      return docs;
    }
  }

  return undefined;
};

/**
 * Get settings from a request (from settings block or root)
 */
export const getRequestSettings = (item: RequestItem | null | undefined): any => {
  if (!item) return {};
  
  // New schema: settings block
  if ('settings' in item && (item as any).settings) {
    return (item as any).settings;
  }
  
  // Backwards compatibility: pick settings fields from root
  const settings: any = {};
  const settingsFields = ['timeout', 'followRedirects', 'maxRedirects', 'encodeUrl'];
  
  for (const field of settingsFields) {
    if (field in item && (item as any)[field] !== undefined) {
      settings[field] = (item as any)[field];
    }
  }
  
  return settings;
};

