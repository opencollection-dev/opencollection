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
  getShortMethod
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

  it('renders multipart preserving text/file part types', () => {
    const view = getBodyView({
      type: 'multipart-form',
      data: [{ name: 'file', type: 'file', value: '/x.pdf' }]
    } as any) as any;
    expect(view.render).toBe('table');
    expect(view.variant).toBe('multipart');
    expect(view.rows[0].partType).toBe('file');
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

describe('requestVars', () => {
  it('reads pre-request variables and flattens typed values', () => {
    const item: any = {
      runtime: { variables: [{ name: 'x', value: '1' }, { name: 'y', value: { type: 'string', data: 'z' } }] }
    };
    expect(getPreRequestVars(item)).toEqual([
      { name: 'x', value: '1', disabled: undefined },
      { name: 'y', value: 'z', disabled: undefined }
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
