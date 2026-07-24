import { describe, it, expect, vi, afterEach } from 'vitest';
import { RequestExecutor, applyApiKeyToUrl } from './RequestExecutor';

describe('applyApiKeyToUrl', () => {
  it('appends the api key as a query param when placement is query', () => {
    const auth = { type: 'apikey', key: 'api_key', value: 'secret123', placement: 'query' };
    expect(applyApiKeyToUrl('https://api.example.com/data', auth)).toBe(
      'https://api.example.com/data?api_key=secret123'
    );
  });

  it('keeps existing query params when appending', () => {
    const auth = { type: 'apikey', key: 'api_key', value: 'secret123', placement: 'query' };
    expect(applyApiKeyToUrl('https://api.example.com/data?foo=bar', auth)).toBe(
      'https://api.example.com/data?foo=bar&api_key=secret123'
    );
  });

  it('leaves the url untouched when placement is not query', () => {
    const auth = { type: 'apikey', key: 'api_key', value: 'secret123', placement: 'header' };
    expect(applyApiKeyToUrl('https://api.example.com/data', auth)).toBe(
      'https://api.example.com/data'
    );
  });

  it('leaves the url untouched when it cannot be parsed', () => {
    const auth = { type: 'apikey', key: 'api_key', value: 'secret123', placement: 'query' };
    expect(applyApiKeyToUrl('api.example.com/data', auth)).toBe('api.example.com/data');
  });

  it('leaves the url untouched when the value is empty', () => {
    const auth = { type: 'apikey', key: 'api_key', value: '', placement: 'query' };
    expect(applyApiKeyToUrl('https://api.example.com/data', auth)).toBe(
      'https://api.example.com/data'
    );
  });
});

describe('RequestExecutor', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('sends the api key in the request url when placement is query', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      statusText: 'OK',
      url: 'https://api.example.com/data',
      headers: new Headers({ 'content-type': 'application/json' }),
      text: async () => JSON.stringify({ ok: true })
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await new RequestExecutor().executeRequest({
      name: 'apikey query',
      type: 'http',
      http: {
        method: 'GET',
        url: 'https://api.example.com/data',
        auth: { type: 'apikey', key: 'api_key', value: 'secret123', placement: 'query' }
      }
    } as any);

    expect(fetchMock.mock.calls[0][0]).toBe('https://api.example.com/data?api_key=secret123');
  });
});
