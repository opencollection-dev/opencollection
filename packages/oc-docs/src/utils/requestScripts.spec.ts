import { describe, it, expect } from 'vitest';
import { buildScriptChain, getScriptFlow } from './requestScripts';

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
