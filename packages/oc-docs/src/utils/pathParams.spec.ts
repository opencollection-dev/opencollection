import { describe, it, expect } from 'vitest';
import {
  parsePathParamNames,
  syncPathParams,
  applyPathParams,
  resolvePathAndQueryParams,
  buildRequestUrl,
  syncQueryParams,
  setUrlQueryParams
} from './pathParams';

describe('parsePathParamNames', () => {
  it('extracts a single path param', () => {
    expect(parsePathParamNames('https://api.com/posts/:postId')).toEqual(['postId']);
  });

  it('extracts multiple path params in order', () => {
    expect(parsePathParamNames('{{host}}/users/:userId/posts/:postId')).toEqual([
      'userId',
      'postId'
    ]);
  });

  it('ignores the query string and fragment', () => {
    expect(parsePathParamNames('/posts/:postId?expand=:nope#:frag')).toEqual(['postId']);
  });

  it('does not treat the protocol or port colon as a param', () => {
    expect(parsePathParamNames('http://localhost:8081/api/:id')).toEqual(['id']);
  });

  it('ignores a bare colon with no name', () => {
    expect(parsePathParamNames('/posts/:')).toEqual([]);
  });

  it('stops the name at the first non-identifier char', () => {
    expect(parsePathParamNames('/posts/:postId.json')).toEqual(['postId']);
  });

  it('de-duplicates repeated names, keeping first-seen order', () => {
    expect(parsePathParamNames('/a/:id/b/:id')).toEqual(['id']);
  });

  it('leaves variable templates untouched', () => {
    expect(parsePathParamNames('{{baseUrl}}/v1/:id')).toEqual(['id']);
  });

  it('handles empty / non-string input', () => {
    expect(parsePathParamNames('')).toEqual([]);
    expect(parsePathParamNames(undefined)).toEqual([]);
    expect(parsePathParamNames(null)).toEqual([]);
  });
});

describe('syncPathParams', () => {
  const query = (name: string, value = ''): any => ({ name, value, type: 'query' });
  const path = (name: string, value = ''): any => ({ name, value, type: 'path' });

  it('adds a path param when the URL gains a :segment', () => {
    const result = syncPathParams([], 'https://api.com/posts/:postId');
    expect(result).toEqual([{ name: 'postId', value: '', type: 'path' }]);
  });

  it('removes a path param when the URL drops the :segment', () => {
    const result = syncPathParams([path('postId', '1')], 'https://api.com/posts');
    expect(result).toEqual([]);
  });

  it('preserves the edited value of a path param that stays in the URL', () => {
    const existing = [path('postId', '42')];
    const result = syncPathParams(existing, 'https://api.com/posts/:postId');
    expect(result).toBe(existing); // reference-stable, value kept
    expect(result[0].value).toBe('42');
  });

  it('never touches query params', () => {
    const result = syncPathParams(
      [query('q', 'alice'), path('postId', '1')],
      'https://api.com/posts/:postId/comments/:commentId'
    );
    expect(result).toEqual([
      { name: 'q', value: 'alice', type: 'query' },
      { name: 'postId', value: '1', type: 'path' }, // value preserved
      { name: 'commentId', value: '', type: 'path' } // newly added
    ]);
  });

  it('returns the same reference when nothing changes', () => {
    const existing = [query('q', 'alice')];
    expect(syncPathParams(existing, 'https://api.com/search')).toBe(existing);
  });

  it('returns the same reference when only the query string changes', () => {
    const existing = [path('id', '7')];
    expect(syncPathParams(existing, 'https://api.com/x/:id?foo=bar')).toBe(existing);
  });

  it('reorders path params to match the URL when the set changes', () => {
    const result = syncPathParams(
      [path('postId', '1'), path('userId', '2')],
      '{{host}}/users/:userId/posts/:postId'
    );
    expect(result.map((p) => p.name)).toEqual(['userId', 'postId']);
    // values still matched by name
    expect(result.find((p) => p.name === 'postId')?.value).toBe('1');
    expect(result.find((p) => p.name === 'userId')?.value).toBe('2');
  });

  it('handles undefined params', () => {
    expect(syncPathParams(undefined, 'https://api.com/posts/:postId')).toEqual([
      { name: 'postId', value: '', type: 'path' }
    ]);
  });
});

describe('applyPathParams', () => {
  const path = (name: string, value: string, extra: object = {}): any => ({
    name,
    value,
    type: 'path',
    ...extra
  });
  const query = (name: string, value: string): any => ({ name, value, type: 'query' });

  it('substitutes a single path param', () => {
    expect(applyPathParams('https://api.com/posts/:postId', [path('postId', '1')])).toBe(
      'https://api.com/posts/1'
    );
  });

  it('substitutes multiple path params', () => {
    expect(
      applyPathParams('{{host}}/users/:userId/posts/:postId', [
        path('userId', '7'),
        path('postId', '99')
      ])
    ).toBe('{{host}}/users/7/posts/99');
  });

  it('leaves the query string untouched and keeps it on the result', () => {
    expect(
      applyPathParams('https://api.com/posts/:postId?expand=true', [path('postId', '1')])
    ).toBe('https://api.com/posts/1?expand=true');
  });

  it('never confuses the port or protocol with a path param', () => {
    expect(applyPathParams('http://localhost:8081/api/:id', [path('id', '5')])).toBe(
      'http://localhost:8081/api/5'
    );
  });

  it('URL-encodes values by default', () => {
    expect(applyPathParams('/files/:name', [path('name', 'a b/c')])).toBe('/files/a%20b%2Fc');
  });

  it('does not encode when encode=false', () => {
    expect(applyPathParams('/files/:name', [path('name', 'a b')], { encode: false })).toBe(
      '/files/a b'
    );
  });

  it('preserves a non-identifier suffix on the segment', () => {
    expect(applyPathParams('/posts/:postId.json', [path('postId', '1')])).toBe('/posts/1.json');
  });

  it('leaves a :segment untouched when no matching param exists', () => {
    expect(applyPathParams('/posts/:postId', [query('q', 'x')])).toBe('/posts/:postId');
  });

  it('skips disabled path params (leaves the segment literal)', () => {
    expect(applyPathParams('/posts/:postId', [path('postId', '1', { disabled: true })])).toBe(
      '/posts/:postId'
    );
  });

  it('replaces every occurrence of a repeated param', () => {
    expect(applyPathParams('/a/:id/b/:id', [path('id', 'X')])).toBe('/a/X/b/X');
  });

  it('returns the url unchanged when there are no path params', () => {
    const url = 'https://api.com/search?q=alice';
    expect(applyPathParams(url, [query('q', 'alice')])).toBe(url);
    expect(applyPathParams(url, [])).toBe(url);
    expect(applyPathParams(url, undefined)).toBe(url);
  });

  it('handles empty / nullish urls', () => {
    expect(applyPathParams('', [path('id', '1')])).toBe('');
    expect(applyPathParams(undefined, [path('id', '1')])).toBe('');
    expect(applyPathParams(null, [path('id', '1')])).toBe('');
  });
});

describe('resolvePathAndQueryParams', () => {
  const path = (name: string, value = ''): any => ({ name, value, type: 'path' });
  const query = (name: string, value = ''): any => ({ name, value, type: 'query' });

  it('splits declared params into path and query, preserving order', () => {
    const { path: p, query: q } = resolvePathAndQueryParams(
      [path('orgId', 'org_42'), query('q', 'alice'), query('role', 'admin')],
      '{{host}}/api/orgs/:orgId/users/search'
    );
    expect(p.map((x) => x.name)).toEqual(['orgId']);
    expect(q.map((x) => x.name)).toEqual(['q', 'role']);
  });

  it('adds path params implied by the URL but not declared', () => {
    const { path: p } = resolvePathAndQueryParams([], '/users/:userId/posts/:postId');
    expect(p.map((x) => x.name)).toEqual(['userId', 'postId']);
    expect(p.every((x) => x.type === 'path')).toBe(true);
  });

  it('keeps the declared value when a path param is both declared and in the URL (no duplicate)', () => {
    const { path: p } = resolvePathAndQueryParams([path('id', '5')], '/users/:id');
    expect(p).toHaveLength(1);
    expect(p[0].name).toBe('id');
    expect(p[0].value).toBe('5');
  });

  it('returns empty arrays for no params and no URL path segments', () => {
    expect(resolvePathAndQueryParams(undefined, undefined)).toEqual({ path: [], query: [] });
  });
});

describe('buildRequestUrl', () => {
  const path = (name: string, value: string, extra: object = {}): any => ({
    name,
    value,
    type: 'path',
    ...extra
  });
  const query = (name: string, value: string, extra: object = {}): any => ({
    name,
    value,
    type: 'query',
    ...extra
  });

  it('appends enabled query params to a URL with no existing query (AC #1)', () => {
    expect(
      buildRequestUrl('https://api.com/users/search', [
        query('q', 'alice'),
        query('role', 'admin'),
        query('status', 'active')
      ])
    ).toBe('https://api.com/users/search?q=alice&role=admin&status=active');
  });

  it('excludes disabled query params (AC #1)', () => {
    expect(
      buildRequestUrl('https://api.com/users/search', [
        query('q', 'alice'),
        query('verbose', 'true', { disabled: true })
      ])
    ).toBe('https://api.com/users/search?q=alice');
  });

  it('substitutes path params into the path (AC #2)', () => {
    expect(
      buildRequestUrl('https://jsonplaceholder.typicode.com/posts/:postId', [path('postId', '1')])
    ).toBe('https://jsonplaceholder.typicode.com/posts/1');
  });

  it('handles path and query params together', () => {
    expect(
      buildRequestUrl('https://api.com/users/:userId/posts', [
        path('userId', '7'),
        query('page', '2')
      ])
    ).toBe('https://api.com/users/7/posts?page=2');
  });

  it('returns the URL unchanged when there are no params (AC #4)', () => {
    expect(buildRequestUrl('https://api.com/health', [])).toBe('https://api.com/health');
    expect(buildRequestUrl('https://api.com/health', undefined)).toBe('https://api.com/health');
  });

  it('returns the URL unchanged when only disabled query params exist (AC #4)', () => {
    expect(
      buildRequestUrl('https://api.com/health', [query('debug', '1', { disabled: true })])
    ).toBe('https://api.com/health');
  });

  it('preserves a query key typed in the URL that the array does not redeclare', () => {
    expect(
      buildRequestUrl('https://api.com/search?expand=true', [query('q', 'alice')])
    ).toBe('https://api.com/search?expand=true&q=alice');
  });

  it('lets the params array override a same-named URL query key (no duplicate)', () => {
    expect(
      buildRequestUrl('https://api.com/search?page=1', [query('page', '5')])
    ).toBe('https://api.com/search?page=5');
  });

  it('leaves a URL with an existing query untouched when there are no params (AC #4)', () => {
    expect(buildRequestUrl('https://api.com/search?foo=bar', [])).toBe(
      'https://api.com/search?foo=bar'
    );
  });

  it('dedupes against a percent-encoded URL key that matches a param name', () => {
    expect(buildRequestUrl('https://api.com/s?my%20param=old', [query('my param', 'new')])).toBe(
      'https://api.com/s?my%20param=new'
    );
  });

  it('treats a plus-encoded URL key as a space when deduping', () => {
    expect(buildRequestUrl('https://api.com/s?my+param=old', [query('my param', 'new')])).toBe(
      'https://api.com/s?my%20param=new'
    );
  });

  it('preserves a URL-only key verbatim when encode=false', () => {
    expect(
      buildRequestUrl('https://api.com/s?keep=1', [query('q', 'x')], { encode: false })
    ).toBe('https://api.com/s?keep=1&q=x');
  });

  it('URL-encodes query names and values by default', () => {
    expect(buildRequestUrl('https://api.com/s', [query('q', 'a b&c')])).toBe(
      'https://api.com/s?q=a%20b%26c'
    );
  });

  it('does not encode when encode=false', () => {
    expect(
      buildRequestUrl('https://api.com/files/:name', [path('name', 'a b'), query('q', 'x y')], {
        encode: false
      })
    ).toBe('https://api.com/files/a b?q=x y');
  });

  it('leaves a :segment literal when its path param is missing, still appends query', () => {
    expect(buildRequestUrl('https://api.com/posts/:postId', [query('q', 'x')])).toBe(
      'https://api.com/posts/:postId?q=x'
    );
  });

  it('preserves a fragment after appending query params', () => {
    expect(buildRequestUrl('https://api.com/docs#section', [query('q', 'x')])).toBe(
      'https://api.com/docs?q=x#section'
    );
  });

  it('keeps {{variable}} templates in the URL untouched', () => {
    expect(buildRequestUrl('{{host}}/api/users/search', [query('q', 'alice')])).toBe(
      '{{host}}/api/users/search?q=alice'
    );
  });

  it('handles empty / nullish urls', () => {
    expect(buildRequestUrl('', [query('q', 'x')])).toBe('');
    expect(buildRequestUrl(undefined, [query('q', 'x')])).toBe('');
    expect(buildRequestUrl(null, [query('q', 'x')])).toBe('');
  });
});

describe('syncQueryParams', () => {
  const query = (name: string, value = '', extra: object = {}): any => ({ name, value, type: 'query', ...extra });
  const path = (name: string, value = ''): any => ({ name, value, type: 'path' });

  it('adds query params when the URL gains a ?a=b string', () => {
    const result = syncQueryParams([], 'https://api.com/search?q=alice&role=admin');
    expect(result).toEqual([
      { name: 'q', value: 'alice', type: 'query' },
      { name: 'role', value: 'admin', type: 'query' }
    ]);
  });

  it('updates the value of an existing query param from the URL', () => {
    const result = syncQueryParams([query('page', '1')], 'https://api.com/x?page=5');
    expect(result).toEqual([{ name: 'page', value: '5', type: 'query' }]);
  });

  it('removes an enabled query param dropped from the URL', () => {
    const result = syncQueryParams([query('q', 'alice'), query('role', 'admin')], 'https://api.com/x?q=alice');
    expect(result.map((p) => p.name)).toEqual(['q']);
  });

  it('preserves a disabled query param the URL does not mention', () => {
    const result = syncQueryParams([query('q', 'alice'), query('debug', 'true', { disabled: true })], 'https://api.com/x?q=alice');
    expect(result).toEqual([
      { name: 'q', value: 'alice', type: 'query' },
      { name: 'debug', value: 'true', type: 'query', disabled: true }
    ]);
  });

  it('leaves path params untouched', () => {
    const result = syncQueryParams([path('id', '7'), query('q', 'alice')], 'https://api.com/x/:id?q=bob');
    expect(result).toEqual([
      { name: 'q', value: 'bob', type: 'query' },
      { name: 'id', value: '7', type: 'path' }
    ]);
  });

  it('keeps values raw (no decode), preserving {{variables}}', () => {
    const result = syncQueryParams([], 'https://api.com/x?q=a%20b&id={{userId}}');
    expect(result).toEqual([
      { name: 'q', value: 'a%20b', type: 'query' },
      { name: 'id', value: '{{userId}}', type: 'query' }
    ]);
  });

  it('keeps a disabled row even when the URL has the same name (dup, like the app)', () => {
    const result = syncQueryParams(
      [query('q', 'live'), query('q', 'off', { disabled: true })],
      'https://api.com/x?q=live'
    );
    expect(result).toEqual([
      { name: 'q', value: 'live', type: 'query' },
      { name: 'q', value: 'off', type: 'query', disabled: true }
    ]);
  });

  it('returns the same reference when nothing changed', () => {
    const existing = [query('q', 'alice')];
    expect(syncQueryParams(existing, 'https://api.com/x?q=alice')).toBe(existing);
  });

  it('handles no query / nullish', () => {
    const existing = [path('id', '1')];
    expect(syncQueryParams(existing, 'https://api.com/x/:id')).toBe(existing);
    expect(syncQueryParams(undefined, 'https://api.com/x')).toEqual([]);
  });
});

describe('setUrlQueryParams', () => {
  const query = (name: string, value = '', extra: object = {}): any => ({ name, value, type: 'query', ...extra });
  const path = (name: string, value = ''): any => ({ name, value, type: 'path' });

  it('writes enabled query params into the URL', () => {
    expect(setUrlQueryParams('https://api.com/search', [query('q', 'alice'), query('role', 'admin')])).toBe(
      'https://api.com/search?q=alice&role=admin'
    );
  });

  it('drops disabled query params', () => {
    expect(setUrlQueryParams('https://api.com/x', [query('q', 'alice'), query('debug', 'true', { disabled: true })])).toBe(
      'https://api.com/x?q=alice'
    );
  });

  it('replaces the existing query string', () => {
    expect(setUrlQueryParams('https://api.com/x?old=1', [query('new', '2')])).toBe('https://api.com/x?new=2');
  });

  it('strips the query when there are no enabled query params', () => {
    expect(setUrlQueryParams('https://api.com/x?old=1', [])).toBe('https://api.com/x');
  });

  it('preserves the path (incl. :name) and fragment; ignores path params', () => {
    expect(setUrlQueryParams('https://api.com/users/:id#frag', [path('id', '7'), query('q', 'x')])).toBe(
      'https://api.com/users/:id?q=x#frag'
    );
  });

  it('keeps names/values raw (no encode), preserving {{variables}}', () => {
    expect(setUrlQueryParams('https://api.com/x', [query('id', '{{userId}}')])).toBe(
      'https://api.com/x?id={{userId}}'
    );
  });
});
