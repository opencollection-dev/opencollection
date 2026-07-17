import { describe, it, expect } from 'vitest';
import { classifyRequestError } from './classifyRequestError';

// Helpers to build the exact error shapes the browser throws.
const timeoutError = () => {
  const e = new Error('signal timed out');
  e.name = 'TimeoutError';
  return e;
};

const abortError = () => {
  const e = new Error('The operation was aborted');
  e.name = 'AbortError';
  return e;
};

const failedToFetch = (message = 'Failed to fetch') => {
  const e = new Error(message);
  e.name = 'TypeError';
  return e;
};

describe('classifyRequestError', () => {
  describe('timeout', () => {
    it('classifies a TimeoutError from AbortSignal.timeout()', () => {
      const result = classifyRequestError(timeoutError());
      expect(result.type).toBe('timeout');
      expect(result.title).toBe('Request timed out');
      expect(result.message).toBe("Request timed out. The server didn't respond in time.");
    });

    it('classifies a manual AbortError', () => {
      expect(classifyRequestError(abortError()).type).toBe('timeout');
    });
  });

  describe('invalid / unsupported HTTP method', () => {
    it('classifies an invalid method token (Chrome phrasing)', () => {
      const result = classifyRequestError(
        failedToFetch("Failed to execute 'fetch' on 'Window': 'PUR GE' is not a valid HTTP method."),
        { pageUrl: 'https://docs.example.com/', requestUrl: 'https://api.example.com/users' }
      );
      expect(result.type).toBe('invalid-method');
      expect(result.title).toBe('Invalid HTTP method');
      expect(result.message).toContain('CONNECT');
    });

    it('classifies a forbidden verb (unsupported method phrasing)', () => {
      const result = classifyRequestError(
        failedToFetch("Failed to execute 'fetch' on 'Window': 'CONNECT' HTTP method is unsupported."),
        { pageUrl: 'https://docs.example.com/', requestUrl: 'https://api.example.com/users' }
      );
      expect(result.type).toBe('invalid-method');
    });

    it('takes precedence over the opaque-fetch-failure classification', () => {
      // Chrome's invalid-method message also contains "fetch"; ordering must not
      // regress into a browser-blocked / unreachable classification.
      const result = classifyRequestError(
        failedToFetch("Failed to execute 'fetch' on 'Window': 'TRACE' HTTP method is unsupported."),
        { pageUrl: 'https://app.example.com/docs', requestUrl: 'https://app.example.com/api' }
      );
      expect(result.type).toBe('invalid-method');
    });

    it('still classifies a genuine network TypeError as an opaque failure', () => {
      const result = classifyRequestError(failedToFetch('Failed to fetch'), {
        pageUrl: 'https://docs.example.com/',
        requestUrl: 'https://api.example.com/users'
      });
      expect(result.type).toBe('browser-blocked');
    });
  });

  describe('mixed content (secure page, insecure URL)', () => {
    it('classifies an https page calling an http URL', () => {
      const result = classifyRequestError(failedToFetch(), {
        pageUrl: 'https://docs.example.com/api.html',
        requestUrl: 'http://api.example.com/users'
      });
      expect(result.type).toBe('mixed-content');
      expect(result.message).toContain('secure (https)');
      expect(result.message).toContain('insecure (http)');
    });
  });

  describe('browser-blocked (CORS — cross-origin or opened from a file)', () => {
    it('classifies a cross-origin request (different host, same site)', () => {
      const result = classifyRequestError(failedToFetch(), {
        pageUrl: 'https://docs.example.com/',
        requestUrl: 'https://api.example.com/users'
      });
      expect(result.type).toBe('browser-blocked');
      expect(result.message).toContain('usually CORS');
      expect(result.message).toContain('Bruno desktop app');
    });

    it('classifies a request from a docs page opened from a file (origin null)', () => {
      const result = classifyRequestError(failedToFetch(), {
        pageUrl: 'file:///Users/me/docs.html',
        requestUrl: 'https://api.example.com/users'
      });
      expect(result.type).toBe('browser-blocked');
    });

    it('never suggests CORS for a same-origin failure', () => {
      const result = classifyRequestError(failedToFetch(), {
        pageUrl: 'https://app.example.com/docs',
        requestUrl: 'https://app.example.com/api/users'
      });
      expect(result.type).not.toBe('browser-blocked');
      expect(result.message.toLowerCase()).not.toContain('cors');
    });
  });

  describe('server unreachable (same origin)', () => {
    it('classifies a same-origin failure as unreachable', () => {
      const result = classifyRequestError(failedToFetch(), {
        pageUrl: 'https://app.example.com/docs',
        requestUrl: 'https://app.example.com/api/users'
      });
      expect(result.type).toBe('unreachable');
      expect(result.message).toBe("Couldn't reach the server. It may be down, or the URL may be wrong.");
    });
  });

  describe('anything else -> underlying message', () => {
    it('surfaces the raw message for a non-network error', () => {
      const result = classifyRequestError(new Error('Something weird happened'));
      expect(result.type).toBe('unknown');
      expect(result.message).toBe('Something weird happened');
    });

    it('falls through to the raw message when the request URL is unparseable', () => {
      // e.g. an unresolved {{baseUrl}} leaves a relative path with no origin to compare.
      const result = classifyRequestError(failedToFetch('Failed to fetch'), {
        pageUrl: 'https://docs.example.com/',
        requestUrl: '/users'
      });
      expect(result.type).toBe('unknown');
      expect(result.message).toBe('Failed to fetch');
    });

    it('falls back to a generic message for a non-Error throw', () => {
      const result = classifyRequestError('boom');
      expect(result.type).toBe('unknown');
      expect(result.message).toBe('The request could not be completed.');
    });
  });
});
