import type { HttpRequest, HttpRequestHeader } from '@opencollection/types/requests/http';
import { isPlainObject } from 'lodash-es';
import { getRequestUrl, getHttpHeaders, getHttpBody, getHttpParams, getRequestAuth } from '@utils/schemaHelpers';
import { templateVariableGlobalRegex } from '@utils/common';
import { mockDataFunctions } from './faker-functions';

// for dynamic vars ({{$randomUUID}} etc.), ported from @usebruno/common.
const MOCK_PATTERN = /\{\{\$(\w+)\}\}/g;
const JSON_SPECIAL_CHARS = /[\\\n\r\t"]/;

const escapeJSONString = (str: string): string => {
  if (!JSON_SPECIAL_CHARS.test(str)) {
    return str;
  }

  return str
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/"/g, '\\"');
};

const prepareMock = (str: string, escapeJSONStrings: boolean): string => {
  return str.replace(MOCK_PATTERN, (match, keyword) => {
    let generatedValue = mockDataFunctions[keyword as keyof typeof mockDataFunctions]?.();

    if (generatedValue === undefined) {
      return match;
    }

    generatedValue = String(generatedValue);

    return escapeJSONStrings ? escapeJSONString(generatedValue) : generatedValue;
  });
};

const prepareMockObj = (obj: Record<string, any>, escapeJSONStrings: boolean): Record<string, any> => {
  const processed: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      processed[key] = prepareMock(value, escapeJSONStrings);
    } else if (isPlainObject(value)) {
      // plain object only, to skip special objects like Date, RegExp, etc.
      processed[key] = prepareMockObj(value, escapeJSONStrings);
    } else {
      processed[key] = value;
    }
  }

  return processed;
};

/**
 * Resolve `{{...}}` in a string: built-in dynamic `{{$var}}` tokens first, then
 * regular `{{var}}` lookups (also resolving dynamic tokens inside var values).
 */
const interpolate = (str: string, variables: Record<string, any>, options: { escapeJSONStrings?: boolean } = {}): string => {
  if (!str || typeof str !== 'string') {
    return str;
  }

  const escapeJSONStrings = options.escapeJSONStrings ?? false;
  const mocked = prepareMock(str, escapeJSONStrings);
  const preparedVars = isPlainObject(variables) ? prepareMockObj(variables, escapeJSONStrings) : variables;

  return mocked.replace(templateVariableGlobalRegex(), (match, variableName) => {
    const trimmedName = variableName.trim();

    // Handle nested object access (e.g., process.env.NODE_ENV)
    const value = getNestedValue(preparedVars, trimmedName);

    if (value === undefined || value === null) {
      return match; // Keep original if variable not found
    }

    let result = String(value);

    // Escape JSON strings if needed
    if (escapeJSONStrings && typeof value === 'string') {
      result = result.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }

    return result;
  });
};

/**
 * Get nested value from object using dot notation
 */
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

/**
 * Get content type from headers
 */
const getContentType = (headers: Record<string, string> = {}): string => {
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === 'content-type') {
      return value;
    }
  }
  return '';
};

/**
 * Enhanced variable interpolation that handles all variable types like Bruno
 */
export const interpolateVars = (
  request: HttpRequest,
  variableSources: {
    globalEnvironmentVariables?: Record<string, any>;
    oauth2CredentialVariables?: Record<string, any>;
    collectionVariables?: Record<string, any>;
    folderVariables?: Record<string, any>;
    requestVariables?: Record<string, any>;
    environmentVariables?: Record<string, any>;
    runtimeVariables?: Record<string, any>;
    processEnvVars?: Record<string, any>;
    promptVariables?: Record<string, any>;
  } = {}
): HttpRequest => {
  // Clone the request to avoid mutation
  const interpolatedRequest = JSON.parse(JSON.stringify(request)) as HttpRequest;

  // Combine all variable sources with proper precedence (later overrides earlier)
  const {
    globalEnvironmentVariables = {},
    oauth2CredentialVariables = {},
    collectionVariables = {},
    folderVariables = {},
    requestVariables = {},
    environmentVariables = {},
    runtimeVariables = {},
    processEnvVars = {},
    promptVariables = {}
  } = variableSources;

  const combinedVariables = {
    ...globalEnvironmentVariables,
    ...collectionVariables,
    ...environmentVariables,
    ...folderVariables,
    ...requestVariables,
    ...oauth2CredentialVariables,
    ...runtimeVariables,
    ...promptVariables,
    process: {
      env: {
        ...processEnvVars
      }
    }
  };

  // Create interpolation function with combined variables
  const _interpolate = (str: string, options: { escapeJSONStrings?: boolean } = {}): string => {
    if (!str || typeof str !== 'string') {
      return str;
    }

    return interpolate(str, combinedVariables, options);
  };

  // Ensure http block exists for mutations
  if (!interpolatedRequest.http) {
    interpolatedRequest.http = { method: 'GET', url: '' };
  }

  // Ensure runtime block exists for mutations
  if (!interpolatedRequest.runtime) {
    interpolatedRequest.runtime = {};
  }

  // Interpolate URL
  const currentUrl = getRequestUrl(interpolatedRequest);
  if (currentUrl) {
    interpolatedRequest.http.url = _interpolate(currentUrl);
  }

  // Interpolate headers
  const currentHeaders = getHttpHeaders(interpolatedRequest);
  if (currentHeaders && currentHeaders.length > 0) {
    const newHeaders: HttpRequestHeader[] = [];
    currentHeaders.forEach((header: HttpRequestHeader) => {
      newHeaders.push({
        ...header,
        name: _interpolate(header.name),
        value: _interpolate(header.value)
      });
    });
    interpolatedRequest.http.headers = newHeaders;
  }

  // Get content type for body interpolation
  const headerMap: Record<string, string> = {};
  const headersForContentType = getHttpHeaders(interpolatedRequest);
  if (headersForContentType) {
    headersForContentType.forEach((header: HttpRequestHeader) => {
      headerMap[header.name] = header.value;
    });
  }
  const contentType = getContentType(headerMap);

  // Interpolate body based on content type
  const currentBody = getHttpBody(interpolatedRequest);
  if (currentBody) {
    const body = currentBody;

    if ('type' in body && 'data' in body) {
      if (contentType.includes('json') && body.type === 'json') {
        // Handle JSON body with proper escaping
        if (typeof body.data === 'string' && body.data.length > 0) {
          body.data = _interpolate(body.data, { escapeJSONStrings: true });
        }
      } else if (contentType === 'application/x-www-form-urlencoded' && body.type === 'form-urlencoded') {
        // Handle form-urlencoded body
        if ('data' in body && Array.isArray(body.data)) {
          body.data = body.data.map((entry: any) => ({
            ...entry,
            value: _interpolate(entry.value)
          }));
        }
      } else if (contentType === 'multipart/form-data' && body.type === 'multipart-form') {
        // Handle multipart form body
        if ('data' in body && Array.isArray(body.data)) {
          body.data = body.data.map((entry: any) => ({
            ...entry,
            value: Array.isArray(entry.value)
              ? entry.value.map((v: any) => _interpolate(String(v)))
              : _interpolate(String(entry.value))
          }));
        }
      } else {
        // Handle other body types
        if (typeof body.data === 'string') {
          body.data = _interpolate(body.data);
        }
      }
      interpolatedRequest.http.body = body;
    }
  }

  // Interpolate query parameters
  const currentParams = getHttpParams(interpolatedRequest);
  if (currentParams && currentParams.length > 0) {
    interpolatedRequest.http.params = currentParams.map((param: any) => ({
      ...param,
      name: _interpolate(param.name),
      value: _interpolate(param.value)
    }));
  }

  // Interpolate authentication
  const currentAuth = getRequestAuth(interpolatedRequest);
  if (currentAuth && typeof currentAuth === 'object') {
    const auth = currentAuth;

    switch (auth.type) {
      case 'basic':
        if ('username' in auth) auth.username = _interpolate(auth.username || '');
        if ('password' in auth) auth.password = _interpolate(auth.password || '');
        break;
      case 'bearer':
        if ('token' in auth) auth.token = _interpolate(auth.token || '');
        break;
      case 'apikey':
        if ('key' in auth) auth.key = _interpolate(auth.key || '');
        if ('value' in auth) auth.value = _interpolate(auth.value || '');
        break;
      case 'awsv4':
        if ('accessKeyId' in auth) auth.accessKeyId = _interpolate(auth.accessKeyId || '');
        if ('secretAccessKey' in auth) auth.secretAccessKey = _interpolate(auth.secretAccessKey || '');
        if ('sessionToken' in auth) auth.sessionToken = _interpolate(auth.sessionToken || '');
        if ('service' in auth) auth.service = _interpolate(auth.service || '');
        if ('region' in auth) auth.region = _interpolate(auth.region || '');
        if ('profileName' in auth) auth.profileName = _interpolate(auth.profileName || '');
        break;
      case 'digest':
        if ('username' in auth) auth.username = _interpolate(auth.username || '');
        if ('password' in auth) auth.password = _interpolate(auth.password || '');
        break;
      case 'ntlm':
        if ('username' in auth) auth.username = _interpolate(auth.username || '');
        if ('password' in auth) auth.password = _interpolate(auth.password || '');
        if ('domain' in auth) auth.domain = _interpolate(auth.domain || '');
        break;
      case 'wsse':
        if ('username' in auth) auth.username = _interpolate(auth.username || '');
        if ('password' in auth) auth.password = _interpolate(auth.password || '');
        break;
    }
  }

  return interpolatedRequest;
};

/**
 * Helper function to create variables object for interpolation
 */
export const createInterpolationVariables = (
  envVars: Record<string, any> = {},
  runtimeVariables: Record<string, any> = {},
  processEnvVars: Record<string, any> = {},
  promptVariables: Record<string, any> = {}
): Record<string, any> => {
  return {
    ...envVars,
    ...runtimeVariables,
    ...promptVariables,
    processEnvVars
  };
};
