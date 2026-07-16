import type { OpenCollection } from '@opencollection/types';
import type { HttpRequest, HttpRequestHeader } from '@opencollection/types/requests/http';
import type { Item } from '@opencollection/types/collection/item';
import type { Scripts, Script, ScriptType } from '@opencollection/types/common/scripts';
import type { Auth } from '@opencollection/types/common/auth';
import { 
  isFolder, 
  getHttpHeaders, 
  getRequestAuth, 
  getHttpMethod,
  getRequestUrl,
  getRequestScripts,
  scriptsArrayToObject,
  scriptsObjectToArray,
  getPreRequestScript,
  getPostResponseScript,
  getTestsScript,
  type ScriptsObject
} from '../../utils/schemaHelpers';

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
 * Merge authentication from collection and folder hierarchy into the request
 */
export const mergeAuth = (collection: OpenCollection, request: HttpRequest, requestTreePath: Item[] = []): void => {
  const requestAuth = getRequestAuth(request);
  
  // If request already has auth that's not 'inherit', don't override
  if (requestAuth && requestAuth !== 'inherit') {
    return;
  }
  
  // Auth lives on the protocol-detail block (request.http.auth); ensure it exists.
  if (!request.http) {
    request.http = {};
  }

  // Look for auth in reverse order (closest to request wins)
  for (let i = requestTreePath.length - 1; i >= 0; i--) {
    const item = requestTreePath[i];
    if (isFolder(item) && item.request?.auth && item.request.auth !== 'inherit') {
      request.http.auth = item.request.auth;
      return;
    }
  }

  // Finally, check collection-level auth
  if (collection.request?.auth && collection.request.auth !== 'inherit') {
    request.http.auth = collection.request.auth;
  }
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
    let currentScripts = { ...collectionScriptsObj };
    
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
