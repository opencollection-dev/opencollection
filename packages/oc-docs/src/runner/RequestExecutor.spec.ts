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
});

describe('RequestExecutor', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  const okFetchMock = () =>
    vi.fn().mockResolvedValue({
      status: 200,
      statusText: 'OK',
      url: 'https://api.example.com/data',
      headers: new Headers({ 'content-type': 'application/json' }),
      text: async () => JSON.stringify({ ok: true })
    });

  const runWithBody = async (method: string) => {
    const fetchMock = okFetchMock();
    global.fetch = fetchMock as unknown as typeof fetch;

    await new RequestExecutor().executeRequest({
      name: `${method} with body`,
      type: 'http',
      http: {
        method,
        url: 'https://api.example.com/data',
        body: { type: 'json', data: '{"hello":"world"}' }
      }
    } as any);

    return (fetchMock.mock.calls[0][1] as RequestInit) ?? {};
  };

  it('sends the api key in the request url when placement is query', async () => {
    const fetchMock = okFetchMock();
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

  it('attaches the body for a custom body-carrying verb like QUERY', async () => {
    const options = await runWithBody('QUERY');
    expect(options.method).toBe('QUERY');
    expect(options.body).toBe('{"hello":"world"}');
  });

  it('does not attach a body for GET or HEAD (fetch would throw)', async () => {
    expect((await runWithBody('GET')).body).toBeUndefined();
    expect((await runWithBody('HEAD')).body).toBeUndefined();
  });

  it('attaches the body for POST, PUT and PATCH as before', async () => {
    expect((await runWithBody('POST')).body).toBe('{"hello":"world"}');
    expect((await runWithBody('PUT')).body).toBe('{"hello":"world"}');
    expect((await runWithBody('PATCH')).body).toBe('{"hello":"world"}');
  });

  it('normalizes lowercase / spaced methods before sending', async () => {
    expect((await runWithBody('get')).method).toBe('GET');
    expect((await runWithBody('get')).body).toBeUndefined();
  });
});
