import { describe, it, expect } from 'vitest';
import { parsePathParamNames, syncPathParams, applyPathParams } from './pathParams';

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
