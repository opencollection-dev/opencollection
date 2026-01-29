import type { HttpRequest } from '@opencollection/types/requests/http';
import { RunRequestResponse } from './index';
import { getHttpMethod, getRequestUrl, getHttpHeaders, getHttpBody, getRequestAuth } from '../utils/schemaHelpers';

export class RequestExecutor {
  async executeRequest(request: HttpRequest, options: { timeout?: number } = {}): Promise<RunRequestResponse> {
    const startTime = Date.now();

    try {
      const fetchOptions = await this.buildFetchOptions(request, options.timeout);
      const requestUrl = getRequestUrl(request);
      const response = await fetch(requestUrl, fetchOptions);
      const endTime = Date.now();

      const responseData = await this.parseResponse(response);
      const responseHeaders = this.parseHeaders(response.headers);

      return {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data: responseData.data,
        size: responseData.size,
        duration: endTime - startTime,
        url: response.url
      };
    } catch (error) {
      const endTime = Date.now();
      let errorMessage = 'Request failed';
      let errorType = 'unknown';

      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Categorize error types
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
          errorType = 'timeout';
          errorMessage = `Request timed out after ${endTime - startTime}ms`;
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
          errorType = 'cors';
          errorMessage = 'CORS error: Failed to fetch. The server either does not include the required CORS headers for this origin or cannot be reached.';
        } else if (error.message.includes('fetch')) {
          errorType = 'network';
        } else if (error.message.includes('SSL') || error.message.includes('certificate')) {
          errorType = 'ssl';
        }
      }

      return {
        error: errorMessage,
        duration: endTime - startTime,
        errorType
      };
    }
  }

  private async buildFetchOptions(request: HttpRequest, timeout = 30000): Promise<RequestInit> {
    const method = getHttpMethod(request);
    const options: RequestInit = {
      method,
      headers: this.buildHeaders(request),
      signal: AbortSignal.timeout(timeout)
    };

    const body = getHttpBody(request);
    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      options.body = await this.buildBody(request);
    }

    return options;
  }

  private buildHeaders(request: HttpRequest): HeadersInit {
    const headers: Record<string, string> = {};
    const requestHeaders = getHttpHeaders(request);
    const body = getHttpBody(request);
    const auth = getRequestAuth(request);

    if (requestHeaders) {
      requestHeaders.forEach(header => {
        if (!header.disabled && header.name && header.value) {
          headers[header.name] = header.value;
        }
      });
    }

    // Auto-set Content-Type for JSON bodies if not already set
    if (body && 'type' in body && body.type === 'json') {
      const hasContentType = requestHeaders?.some(h => 
        !h.disabled && h.name.toLowerCase() === 'content-type'
      );
      if (!hasContentType) {
        headers['Content-Type'] = 'application/json';
      }
    }

    if (auth) {
      this.setAuthHeaders(headers, auth);
    }

    return headers;
  }

  private setAuthHeaders(headers: Record<string, string>, auth: any) {
    switch (auth.type) {
      case 'basic':
        if (auth.username && auth.password) {
          const credentials = btoa(`${auth.username}:${auth.password}`);
          headers['Authorization'] = `Basic ${credentials}`;
        }
        break;
      case 'bearer':
        if (auth.token) {
          headers['Authorization'] = `Bearer ${auth.token}`;
        }
        break;
      case 'apikey':
        if (auth.key && auth.value) {
          if (auth.placement === 'header') {
            headers[auth.key] = auth.value;
          }
        }
        break;
    }
  }

  private async buildBody(request: HttpRequest): Promise<BodyInit | null> {
    const body = getHttpBody(request);
    const headers = getHttpHeaders(request);
    
    if (!body) return null;

    if ('type' in body) {
      switch (body.type) {
        case 'json':
          return body.data;
        case 'text':
        case 'xml':
        case 'sparql':
          return body.data;
        case 'form-urlencoded':
          if ('data' in body && Array.isArray(body.data)) {
            return this.buildUrlEncodedBody(body.data);
          }
          return null;
        default:
          return null;
      }
    } else if (Array.isArray(body)) {
      if (headers?.some(h => h.name.toLowerCase() === 'content-type' && h.value === 'application/x-www-form-urlencoded')) {
        return this.buildUrlEncodedBody(body);
      } else {
        return this.buildFormDataBody(body);
      }
    }

    return null;
  }

  private buildUrlEncodedBody(data: any[]): string {
    const params = new URLSearchParams();
    data.forEach(item => {
      if (item.disabled !== true && item.name) {
        params.append(item.name, item.value || '');
      }
    });
    return params.toString();
  }

  private buildFormDataBody(data: any[]): FormData {
    const formData = new FormData();
    data.forEach(item => {
      if (item.disabled !== true && item.name) {
        if (item.type === 'file' && item.value instanceof File) {
          formData.append(item.name, item.value);
        } else {
          formData.append(item.name, item.value || '');
        }
      }
    });
    return formData;
  }

  private async parseResponse(response: Response) {
    const contentType = response.headers.get('content-type') || '';
    let data: any;
    let size = 0;

    if (contentType.includes('application/json')) {
      const text = await response.text();
      size = new Blob([text]).size;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    } else {
      data = await response.text();
      size = new Blob([data]).size;
    }

    return { data, size };
  }

  private parseHeaders(headers: Headers): Record<string, any> {
    const result: Record<string, any> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
} 