import type { OpenCollection } from '@opencollection/types';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Item } from '@opencollection/types/collection/item';
import type { HttpHeader } from '@opencollection/types/requests/http';
import type { Scripts } from '@opencollection/types/common/scripts';
import type { Auth } from '@opencollection/types/common/auth';

/**
 * Merge headers from collection and folder hierarchy into the request
 */
export const mergeHeaders = (collection: OpenCollection, request: HttpRequest, requestTreePath: Item[] = []): void => {
  const headers = new Map<string, HttpHeader>();
  
  // Start with collection-level headers
  const collectionHeaders = collection.request?.headers || [];
  collectionHeaders.forEach((header) => {
    if (!header.disabled) {
      headers.set(header.name.toLowerCase(), header);
    }
  });
  
  // Apply folder-level headers in order (parent to child)
  for (const item of requestTreePath) {
    if (item.type === 'folder') {
      const folderHeaders = item.request?.headers || [];
      folderHeaders.forEach((header) => {
        if (!header.disabled) {
          headers.set(header.name.toLowerCase(), header);
        }
      });
    }
  }
  
  // Initialize request headers if not present
  if (!request.headers) {
    request.headers = [];
  }
  
  // Merge with existing request headers (request headers take precedence)
  const requestHeaderMap = new Map<string, HttpHeader>();
  request.headers.forEach((header) => {
    requestHeaderMap.set(header.name.toLowerCase(), header);
  });
  
  // Add merged headers that don't exist in request
  headers.forEach((header, name) => {
    if (!requestHeaderMap.has(name)) {
      request.headers!.push(header);
    }
  });
};

/**
 * Merge authentication from collection and folder hierarchy into the request
 */
export const mergeAuth = (collection: OpenCollection, request: HttpRequest, requestTreePath: Item[] = []): void => {
  // If request already has auth that's not 'inherit', don't override
  if (request.auth && request.auth !== 'inherit') {
    return;
  }
  
  // Look for auth in reverse order (closest to request wins)
  for (let i = requestTreePath.length - 1; i >= 0; i--) {
    const item = requestTreePath[i];
    if (item.type === 'folder' && item.request?.auth && item.request.auth !== 'inherit') {
      request.auth = item.request.auth;
      return;
    }
  }
  
  // Finally, check collection-level auth
  if (collection.request?.auth && collection.request.auth !== 'inherit') {
    request.auth = collection.request.auth;
  }
};

/**
 * Merge scripts from collection and folder hierarchy into the request
 */
export const mergeScripts = (
  collection: OpenCollection, 
  request: HttpRequest, 
  requestTreePath: Item[] = [], 
  flow: 'sandwich' | 'sequential' = 'sandwich'
): void => {
  const collectionScripts = collection.request?.scripts || {};
  const folderScripts: Scripts[] = [];
  
  // Collect folder scripts in order
  for (const item of requestTreePath) {
    if (item.type === 'folder' && item.request?.scripts) {
      folderScripts.push(item.request.scripts);
    }
  }
  
  const requestScripts = request.scripts || {};
  
  // Initialize merged scripts
  const mergedScripts: Scripts = {};
  
  if (flow === 'sandwich') {
    // Sandwich flow: collection -> folders -> request -> folders (reverse) -> collection
    const preRequestParts: string[] = [];
    const postResponseParts: string[] = [];
    const testsParts: string[] = [];
    
    // Add collection pre-request
    if (collectionScripts.preRequest) {
      preRequestParts.push(collectionScripts.preRequest);
    }
    
    // Add folder pre-request scripts
    folderScripts.forEach((scripts) => {
      if (scripts.preRequest) {
        preRequestParts.push(scripts.preRequest);
      }
    });
    
    // Add request pre-request
    if (requestScripts.preRequest) {
      preRequestParts.push(requestScripts.preRequest);
    }
    
    // Add request post-response
    if (requestScripts.postResponse) {
      postResponseParts.push(requestScripts.postResponse);
    }
    
    // Add folder post-response scripts in reverse order
    folderScripts.reverse().forEach((scripts) => {
      if (scripts.postResponse) {
        postResponseParts.push(scripts.postResponse);
      }
    });
    
    // Add collection post-response
    if (collectionScripts.postResponse) {
      postResponseParts.push(collectionScripts.postResponse);
    }
    
    // Tests are additive
    if (collectionScripts.tests) {
      testsParts.push(collectionScripts.tests);
    }
    folderScripts.forEach((scripts) => {
      if (scripts.tests) {
        testsParts.push(scripts.tests);
      }
    });
    if (requestScripts.tests) {
      testsParts.push(requestScripts.tests);
    }
    
    mergedScripts.preRequest = preRequestParts.length > 0 ? preRequestParts.join('\n\n') : undefined;
    mergedScripts.postResponse = postResponseParts.length > 0 ? postResponseParts.join('\n\n') : undefined;
    mergedScripts.tests = testsParts.length > 0 ? testsParts.join('\n\n') : undefined;
  } else {
    // Sequential flow: collection -> folders -> request (each overrides previous)
    let currentScripts = { ...collectionScripts };
    
    folderScripts.forEach((scripts) => {
      if (scripts.preRequest) currentScripts.preRequest = scripts.preRequest;
      if (scripts.postResponse) currentScripts.postResponse = scripts.postResponse;
      if (scripts.tests) currentScripts.tests = scripts.tests;
    });
    
    if (requestScripts.preRequest) currentScripts.preRequest = requestScripts.preRequest;
    if (requestScripts.postResponse) currentScripts.postResponse = requestScripts.postResponse;
    if (requestScripts.tests) currentScripts.tests = requestScripts.tests;
    
    mergedScripts.preRequest = currentScripts.preRequest;
    mergedScripts.postResponse = currentScripts.postResponse;
    mergedScripts.tests = currentScripts.tests;
  }
  
  request.scripts = mergedScripts;
};
