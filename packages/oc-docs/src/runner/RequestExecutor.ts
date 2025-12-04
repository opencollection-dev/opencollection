import type { HttpRequest } from '@opencollection/types/requests/http';
import { RunRequestResponse } from './index';

export class RequestExecutor {
  async executeRequest(request: HttpRequest, options: { timeout?: number } = {}): Promise<RunRequestResponse> {
    const startTime = Date.now();

    try {
      const fetchOptions = await this.buildFetchOptions(request, options.timeout);
      const response = await fetch(request.url || '', fetchOptions);
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
    const options: RequestInit = {
      method: request.method || 'GET',
      headers: this.buildHeaders(request),
      signal: AbortSignal.timeout(timeout)
    };

    if (request.body && ['POST', 'PUT', 'PATCH'].includes(request.method || '')) {
      options.body = await this.buildBody(request);
    }

    return options;
  }

  private buildHeaders(request: HttpRequest): HeadersInit {
    const headers: Record<string, string> = {};

    if (request.headers) {
      request.headers.forEach(header => {
        if (!header.disabled && header.name && header.value) {
          headers[header.name] = header.value;
        }
      });
    }

    // Auto-set Content-Type for JSON bodies if not already set
    if (request.body && 'type' in request.body && request.body.type === 'json') {
      const hasContentType = request.headers?.some(h => 
        !h.disabled && h.name.toLowerCase() === 'content-type'
      );
      if (!hasContentType) {
        headers['Content-Type'] = 'application/json';
      }
    }

    if (request.auth) {
      this.setAuthHeaders(headers, request.auth);
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
    if (!request.body) return null;

    if ('type' in request.body) {
      switch (request.body.type) {
        case 'json':
          return request.body.data;
        case 'text':
        case 'xml':
        case 'sparql':
          return request.body.data;
        default:
          return null;
      }
    } else if (Array.isArray(request.body)) {
      if (request.headers?.some(h => h.name.toLowerCase() === 'content-type' && h.value === 'application/x-www-form-urlencoded')) {
        return this.buildUrlEncodedBody(request.body);
      } else {
        return this.buildFormDataBody(request.body);
      }
    }

    return null;
  }

  private buildUrlEncodedBody(data: any[]): string {
    const params = new URLSearchParams();
    data.forEach(item => {
      if (item.enabled !== false && item.name) {
        params.append(item.name, item.value || '');
      }
    });
    return params.toString();
  }

  private buildFormDataBody(data: any[]): FormData {
    const formData = new FormData();
    data.forEach(item => {
      if (item.enabled !== false && item.name) {
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