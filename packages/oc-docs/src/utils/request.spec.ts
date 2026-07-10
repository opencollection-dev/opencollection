import { describe, it, expect } from 'vitest';
import {
  humanizeAuthMode,
  resolveInheritedAuth,
  getBodyView,
  selectBodyVariant,
  buildScriptChain,
  getScriptFlow,
  getPreRequestVars,
  getPostResponseVars,
  getCollectionVariables,
  getShortMethod,
  getValueType,
  getVariableType
} from './request';
import { AUTH_MODE_LABELS } from '../constants';

describe('requestAuth', () => {
  it('humanizes auth modes with fallbacks', () => {
    expect(humanizeAuthMode(undefined, AUTH_MODE_LABELS)).toBe('No Auth');
    expect(humanizeAuthMode('inherit', AUTH_MODE_LABELS)).toBe('Inherit');
    expect(humanizeAuthMode({ type: 'basic' } as any, AUTH_MODE_LABELS)).toBe('Basic Auth');
  });

  it('returns own auth when it is not inherit', () => {
    const item: any = { runtime: { auth: { type: 'bearer', token: 't' } } };
    expect(resolveInheritedAuth(null, [], item).auth).toMatchObject({ type: 'bearer' });
  });

  it('resolves inherited auth from the nearest concrete ancestor, else collection', () => {
    const item: any = { runtime: { auth: 'inherit' } };
    const folder: any = { info: { type: 'folder', name: 'F' }, request: { auth: { type: 'apikey', key: 'k' } } };
    const resolved = resolveInheritedAuth({ info: { name: 'C' } } as any, [folder], item);
    expect(resolved.auth).toMatchObject({ type: 'apikey' });
    expect(resolved.source).toEqual({ level: 'folder', name: 'F' });
  });

  it('falls back to collection auth when no ancestor defines one', () => {
    const item: any = { runtime: { auth: 'inherit' } };
    const collection: any = { info: { name: 'C' }, request: { auth: { type: 'bearer', token: 't' } } };
    const resolved = resolveInheritedAuth(collection, [], item);
    expect(resolved.auth).toMatchObject({ type: 'bearer' });
    expect(resolved.source).toEqual({ level: 'collection', name: 'C' });
  });
});

describe('requestBody', () => {
  it('renders raw json as a code view', () => {
    expect(getBodyView({ type: 'json', data: '{"a":1}' } as any)).toMatchObject({
      render: 'code',
      language: 'json',
      contentTypeLabel: 'application/json',
      code: '{"a":1}'
    });
  });

  it('treats empty raw data as none', () => {
    expect(getBodyView({ type: 'json', data: '   ' } as any).render).toBe('none');
  });

  it('renders form-urlencoded as a table', () => {
    expect(getBodyView({ type: 'form-urlencoded', data: [{ name: 'a', value: '1' }] } as any)).toMatchObject({
      render: 'table',
      variant: 'urlencoded',
      contentTypeLabel: 'application/x-www-form-urlencoded'
    });
  });

  it('treats an empty / all-blank form-urlencoded body as none', () => {
    expect(getBodyView({ type: 'form-urlencoded', data: [] } as any).render).toBe('none');
    expect(getBodyView({ type: 'form-urlencoded', data: [{ name: '', value: '' }] } as any).render).toBe('none');
  });

  it('treats an empty / all-blank multipart body as none', () => {
    expect(getBodyView({ type: 'multipart-form', data: [] } as any).render).toBe('none');
    expect(getBodyView({ type: 'multipart-form', data: [{ name: '', value: '' }] } as any).render).toBe('none');
  });

  it('carries entry descriptions through to the table rows', () => {
    const view = getBodyView({
      type: 'form-urlencoded',
      data: [{ name: 'a', value: '1', description: 'the a field' }]
    } as any) as any;
    expect(view.rows[0].description).toBe('the a field');
  });

  it('renders multipart preserving text/file part types and per-part content types', () => {
    const view = getBodyView({
      type: 'multipart-form',
      data: [{ name: 'file', type: 'file', value: '/x.pdf', contentType: 'application/pdf' }]
    } as any) as any;
    expect(view.render).toBe('table');
    expect(view.variant).toBe('multipart');
    expect(view.rows[0].partType).toBe('file');
    expect(view.rows[0].contentType).toBe('application/pdf');
  });

  it('reports every file-body variant with its content type and selected flag', () => {
    const view = getBodyView({
      type: 'file',
      data: [
        { filePath: '/a.json', contentType: 'application/json', selected: true, description: 'Primary payload' },
        { filePath: '/b.xml', contentType: 'application/xml', selected: false }
      ]
    } as any) as any;
    expect(view.render).toBe('file');
    expect(view.files).toHaveLength(2);
    expect(view.files[0]).toMatchObject({
      filePath: '/a.json',
      contentType: 'application/json',
      selected: true,
      description: 'Primary payload'
    });
  });

  it('treats an empty file body as none', () => {
    expect(getBodyView({ type: 'file', data: [] } as any).render).toBe('none');
  });

  it('selects the chosen body variant and reports variants', () => {
    const selected = selectBodyVariant([
      { title: 'A', body: { type: 'json', data: '1' } },
      { title: 'B', selected: true, body: { type: 'text', data: 'b' } }
    ] as any);
    expect(selected.body).toMatchObject({ type: 'text' });
    expect(selected.variants?.length).toBe(2);
  });

  it('returns none for an undefined body', () => {
    expect(getBodyView(undefined).render).toBe('none');
  });
});

describe('getScriptFlow', () => {
  it('reads extensions.config.scripts.flow', () => {
    expect(getScriptFlow({ extensions: { config: { scripts: { flow: 'sequential' } } } } as any)).toBe('sequential');
    expect(getScriptFlow({ extensions: { config: { scripts: { flow: 'sandwich' } } } } as any)).toBe('sandwich');
  });

  it('falls back to the typed config.scripts.flow', () => {
    expect(getScriptFlow({ config: { scripts: { flow: 'sequential' } } } as any)).toBe('sequential');
    expect(getScriptFlow({ config: { scripts: { flow: 'sandwich' } } } as any)).toBe('sandwich');
  });

  it('prefers extensions.config.scripts.flow over the typed config.scripts.flow', () => {
    expect(
      getScriptFlow({
        extensions: { config: { scripts: { flow: 'sequential' } } },
        config: { scripts: { flow: 'sandwich' } }
      } as any)
    ).toBe('sequential');
  });

  // Always resolves to exactly one flow — anything that isn't `sequential` is `sandwich`.
  it('defaults to sandwich for every other case', () => {
    expect(getScriptFlow(null)).toBe('sandwich');
    expect(getScriptFlow(undefined)).toBe('sandwich');
    expect(getScriptFlow({} as any)).toBe('sandwich');
    expect(getScriptFlow({ extensions: {} } as any)).toBe('sandwich');
    expect(getScriptFlow({ extensions: { config: {} } } as any)).toBe('sandwich');
    expect(getScriptFlow({ extensions: { config: { scripts: {} } } } as any)).toBe('sandwich');
    expect(getScriptFlow({ config: {} } as any)).toBe('sandwich');
    expect(getScriptFlow({ config: { scripts: {} } } as any)).toBe('sandwich');
    // Unknown / malformed values never leak through.
    expect(getScriptFlow({ extensions: { config: { scripts: { flow: 'parallel' } } } } as any)).toBe('sandwich');
    expect(getScriptFlow({ extensions: { config: 'oops' } } as any)).toBe('sandwich');
    expect(getScriptFlow({ extensions: 'oops' } as any)).toBe('sandwich');
  });
});

describe('buildScriptChain', () => {
  it('orders pre-request collection→folder→request, then post-response reversed', () => {
    const collection: any = {
      info: { name: 'C' },
      request: { scripts: [{ type: 'before-request', code: 'coll pre' }, { type: 'after-response', code: 'coll post' }] }
    };
    const folder: any = {
      info: { type: 'folder', name: 'F' },
      request: { scripts: [{ type: 'before-request', code: 'fold pre' }] }
    };
    const item: any = {
      runtime: { scripts: [{ type: 'before-request', code: 'req pre' }, { type: 'after-response', code: 'req post' }] }
    };

    const chain = buildScriptChain(collection, [folder], item);
    expect(chain.map((s) => `${s.level}:${s.phase}`)).toEqual([
      'collection:before-request',
      'folder:before-request',
      'request:before-request',
      'request:after-response',
      'collection:after-response'
    ]);
    expect(chain[0]).toMatchObject({ label: 'Collection Pre-Request', code: 'coll pre' });
    expect(chain[2]).toMatchObject({ label: 'Request Pre-Request' });
    // Hierarchy index: collection=0, folder=1, request=2 — independent of phase.
    const orderOf = (level: string, phase: string) =>
      chain.find((s) => s.level === level && s.phase === phase)?.order;
    expect(orderOf('collection', 'before-request')).toBe(0);
    expect(orderOf('folder', 'before-request')).toBe(1);
    expect(orderOf('request', 'before-request')).toBe(2);
    expect(orderOf('collection', 'after-response')).toBe(0);
    expect(orderOf('request', 'after-response')).toBe(2);
  });

  it('skips empty scripts', () => {
    const item: any = { runtime: { scripts: [{ type: 'before-request', code: '   ' }] } };
    expect(buildScriptChain(null, [], item)).toEqual([]);
  });
});

describe('getValueType', () => {
  it('returns a free-form data-type from a header/param', () => {
    expect(getValueType({ name: 'X-Trace-Id', value: '{{uuid}}', type: 'uuid' })).toBe('uuid');
  });

  it('ignores a param query/path location (not a data-type)', () => {
    expect(getValueType({ name: 'id', value: '1', type: 'path' })).toBeUndefined();
    expect(getValueType({ name: 'q', value: 'x', type: 'query' })).toBeUndefined();
  });

  it('returns undefined when there is no type', () => {
    expect(getValueType({ name: 'Accept', value: 'application/json' })).toBeUndefined();
    expect(getValueType(null)).toBeUndefined();
  });
});

describe('getVariableType', () => {
  it('reads a typed value, a secret type, and the selected variant', () => {
    expect(getVariableType({ name: 'a', value: { type: 'number', data: '1' } } as any)).toBe('number');
    expect(getVariableType({ name: 'b', secret: true, type: 'string' } as any)).toBe('string');
    expect(
      getVariableType({ name: 'c', value: [{ title: 't', selected: true, value: { type: 'object', data: '{}' } }] } as any)
    ).toBe('object');
  });

  it('returns undefined for a plain string value', () => {
    expect(getVariableType({ name: 'd', value: 'plain' } as any)).toBeUndefined();
  });
});

describe('requestVars', () => {
  it('reads pre-request variables, flattening typed values and surfacing their data-type', () => {
    const item: any = {
      runtime: { variables: [{ name: 'x', value: '1' }, { name: 'y', value: { type: 'string', data: 'z' } }] }
    };
    expect(getPreRequestVars(item)).toEqual([
      { name: 'x', value: '1', type: undefined, disabled: undefined },
      { name: 'y', value: 'z', type: 'string', disabled: undefined }
    ]);
  });

  it('reads post-response captures from set-variable actions', () => {
    const item: any = {
      runtime: {
        actions: [
          {
            type: 'set-variable',
            phase: 'after-response',
            selector: { expression: 'res.body.token', method: 'jsonq' },
            variable: { name: 'authToken', scope: 'environment' }
          }
        ]
      }
    };
    expect(getPostResponseVars(item)).toEqual([
      { name: 'authToken', expression: 'res.body.token', scope: 'environment', disabled: undefined }
    ]);
  });

  it('carries pre-request and post-response variable descriptions through to the rows', () => {
    const item: any = {
      runtime: {
        variables: [{ name: 'sessionId', value: '{{$randomUUID}}', description: 'Unique session identifier' }],
        actions: [
          {
            type: 'set-variable',
            phase: 'after-response',
            selector: { expression: 'res.body.token' },
            variable: { name: 'authToken', scope: 'environment' },
            description: { content: 'JWT access token from the login response', type: 'text' }
          }
        ]
      }
    };
    expect(getPreRequestVars(item)[0].description).toBe('Unique session identifier');
    expect(getPostResponseVars(item)[0].description).toBe('JWT access token from the login response');
  });
});

describe('getCollectionVariables', () => {
  it('reads collection pre-request (request.variables) and post-response (request.actions) vars', () => {
    const collection: any = {
      request: {
        variables: [
          { name: 'baseUrl', value: 'https://api.example.com' },
          { name: 'legacy', value: 'x', disabled: true }
        ],
        actions: [
          {
            type: 'set-variable',
            phase: 'after-response',
            selector: { expression: 'res.body.token' },
            variable: { name: 'token', scope: 'collection' }
          }
        ]
      }
    };
    const { preVars, postVars } = getCollectionVariables(collection);
    expect(preVars).toEqual([
      { name: 'baseUrl', value: 'https://api.example.com', disabled: undefined },
      { name: 'legacy', value: 'x', disabled: true }
    ]);
    expect(postVars).toEqual([
      { name: 'token', expression: 'res.body.token', scope: 'collection', disabled: undefined }
    ]);
  });

  it('returns empty arrays and skips malformed / unnamed entries', () => {
    expect(getCollectionVariables(null)).toEqual({ preVars: [], postVars: [] });
    expect(getCollectionVariables({} as any)).toEqual({ preVars: [], postVars: [] });
    const collection: any = {
      request: {
        variables: [{ value: 'noName' }, null],
        actions: [
          { type: 'set-variable', phase: 'before-request', variable: { name: 'skipMe' }, selector: { expression: 'x' } },
          { type: 'set-variable', variable: {}, selector: {} }
        ]
      }
    };
    const { preVars, postVars } = getCollectionVariables(collection);
    expect(preVars).toEqual([]);
    expect(postVars).toEqual([]);
  });
});

describe('getShortMethod', () => {
  it('abbreviates DELETE and OPTIONS', () => {
    expect(getShortMethod('DELETE')).toBe('DEL');
    expect(getShortMethod('OPTIONS')).toBe('OPT');
  });
  it('uppercases and passes other methods through', () => {
    expect(getShortMethod('get')).toBe('GET');
    expect(getShortMethod('PATCH')).toBe('PATCH');
    expect(getShortMethod('purge')).toBe('PURGE');
  });
});
