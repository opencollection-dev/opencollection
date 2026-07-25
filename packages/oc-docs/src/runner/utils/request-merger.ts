import type { OpenCollection } from '@opencollection/types';
import type { HttpRequest, HttpRequestHeader } from '@opencollection/types/requests/http';
import type { Item } from '@opencollection/types/collection/item';
import type { Scripts } from '@opencollection/types/common/scripts';
import {
  isFolder,
  getHttpHeaders, 
  getRequestAuth, 
  getHttpMethod,
  getRequestUrl,
  getRequestScripts,
  scriptsArrayToObject,
  scriptsObjectToArray,
  type ScriptsObject
} from '../../utils/schemaHelpers';
import { resolveInheritedAuth } from '../../utils/request';

/**
 * Merge headers from collection and folder hierarchy into the request
 */
export const mergeHeaders = (collection: OpenCollection, request: HttpRequest, requestTreePath: Item[] = []): void => {
  const headers = new Map<string, HttpRequestHeader>();
  
  // Start with collection-level headers
  const collectionHeaders = collection.request?.headers || [];
  collectionHeaders.forEach((header) => {
    if (!header.disabled) {
      headers.set(header.name.toLowerCase(), header);
    }
  });
  
  // Apply folder-level headers in order (parent to child)
  for (const item of requestTreePath) {
    if (isFolder(item)) {
      const folderHeaders = item.request?.headers || [];
      folderHeaders.forEach((header) => {
        if (!header.disabled) {
          headers.set(header.name.toLowerCase(), header);
        }
      });
    }
  }
  
  // Get current request headers
  const currentHeaders = getHttpHeaders(request);
  
  // Initialize request http block if not present, carrying the real method/url
  // so a flat-shape request's method isn't lost to a hardcoded default.
  if (!request.http) {
    request.http = { method: getHttpMethod(request), url: getRequestUrl(request) };
  }
  if (!request.http.headers) {
    request.http.headers = [];
  }

  // Merge with existing request headers (request headers take precedence)
  const requestHeaderMap = new Map<string, HttpRequestHeader>();
  currentHeaders.forEach((header) => {
    requestHeaderMap.set(header.name.toLowerCase(), header);
  });
  
  // Add merged headers that don't exist in request
  headers.forEach((header, name) => {
    if (!requestHeaderMap.has(name)) {
      request.http!.headers!.push(header);
    }
  });
};

/**
 * Resolve inherited authentication into the request for the send path. Delegates to the shared
 * resolver (`utils/request.ts` resolveInheritedAuth) so the wire and the docs display can never
 * drift: only an explicit `inherit` resolves; the closest level that made an auth choice wins (a
 * concrete mode applies, an explicit No Auth blocks a parent, an `inherit` folder is transparent) —
 * matching the desktop app (bruno-electron `mergeAuth`).
 */
export const mergeAuth = (collection: OpenCollection, request: HttpRequest, requestTreePath: Item[] = []): void => {
  if (getRequestAuth(request) !== 'inherit') {
    return;
  }

  const { auth } = resolveInheritedAuth(collection, requestTreePath, request);

  // Auth lives on the protocol-detail block (request.http.auth); ensure it exists.
  if (!request.http) {
    request.http = {};
  }
  // The resolved auth is copied through untouched whatever its `type` (mode-agnostic). Deep-clone so
  // the per-run request never aliases the shared collection/folder auth, including nested structure
  // a richer type carries (e.g. oauth2 additional-parameter arrays).
  request.http.auth = auth ? JSON.parse(JSON.stringify(auth)) : undefined;
};

/**
 * Merge scripts from collection and folder hierarchy into the request
 * Scripts are now in array format: [{ type: 'before-request' | 'after-response' | 'tests' | 'hooks', code: string }]
 */
export const mergeScripts = (
  collection: OpenCollection, 
  request: HttpRequest, 
  requestTreePath: Item[] = [], 
  flow: 'sandwich' | 'sequential' = 'sandwich'
): void => {
  // Convert all scripts to object format for easier merging
  const collectionScriptsObj = scriptsArrayToObject(collection.request?.scripts as Scripts | undefined);
  const folderScriptsObjs: ScriptsObject[] = [];
  
  // Collect folder scripts in order
  for (const item of requestTreePath) {
    if (isFolder(item) && item.request?.scripts) {
      folderScriptsObjs.push(scriptsArrayToObject(item.request.scripts as Scripts));
    }
  }
  
  const requestScriptsObj = scriptsArrayToObject(getRequestScripts(request));
  
  // Initialize merged scripts as object
  const mergedScriptsObj: Record<string, string | undefined> = {};

  if (flow === 'sandwich') {
    // Sandwich flow: collection -> folders -> request -> folders (reverse) -> collection
    const preRequestParts: string[] = [];
    const postResponseParts: string[] = [];
    const testsParts: string[] = [];
    
    // Add collection pre-request
    if (collectionScriptsObj.preRequest) {
      preRequestParts.push(collectionScriptsObj.preRequest);
    }
    
    // Add folder pre-request scripts
    folderScriptsObjs.forEach((scripts) => {
      if (scripts.preRequest) {
        preRequestParts.push(scripts.preRequest);
      }
    });
    
    // Add request pre-request
    if (requestScriptsObj.preRequest) {
      preRequestParts.push(requestScriptsObj.preRequest);
    }
    
    // Add request post-response
    if (requestScriptsObj.postResponse) {
      postResponseParts.push(requestScriptsObj.postResponse);
    }
    
    // Add folder post-response scripts in reverse order
    [...folderScriptsObjs].reverse().forEach((scripts) => {
      if (scripts.postResponse) {
        postResponseParts.push(scripts.postResponse);
      }
    });
    
    // Add collection post-response
    if (collectionScriptsObj.postResponse) {
      postResponseParts.push(collectionScriptsObj.postResponse);
    }
    
    // Tests are additive
    if (collectionScriptsObj.tests) {
      testsParts.push(collectionScriptsObj.tests);
    }
    folderScriptsObjs.forEach((scripts) => {
      if (scripts.tests) {
        testsParts.push(scripts.tests);
      }
    });
    if (requestScriptsObj.tests) {
      testsParts.push(requestScriptsObj.tests);
    }

    mergedScriptsObj.preRequest = preRequestParts.length > 0 ? preRequestParts.join('\n\n') : undefined;
    mergedScriptsObj.postResponse = postResponseParts.length > 0 ? postResponseParts.join('\n\n') : undefined;
    mergedScriptsObj.tests = testsParts.length > 0 ? testsParts.join('\n\n') : undefined;
  } else {
    // Sequential flow: collection -> folders -> request (each overrides previous)
    const currentScripts = { ...collectionScriptsObj };
    
    folderScriptsObjs.forEach((scripts) => {
      if (scripts.preRequest) currentScripts.preRequest = scripts.preRequest;
      if (scripts.postResponse) currentScripts.postResponse = scripts.postResponse;
      if (scripts.tests) currentScripts.tests = scripts.tests;
    });
    
    if (requestScriptsObj.preRequest) currentScripts.preRequest = requestScriptsObj.preRequest;
    if (requestScriptsObj.postResponse) currentScripts.postResponse = requestScriptsObj.postResponse;
    if (requestScriptsObj.tests) currentScripts.tests = requestScriptsObj.tests;
    
    mergedScriptsObj.preRequest = currentScripts.preRequest;
    mergedScriptsObj.postResponse = currentScripts.postResponse;
    mergedScriptsObj.tests = currentScripts.tests;
  }
  
  // Initialize runtime block if not present
  if (!request.runtime) {
    request.runtime = {};
  }
  
  // Convert merged scripts back to array format
  request.runtime.scripts = scriptsObjectToArray(mergedScriptsObj);
};
