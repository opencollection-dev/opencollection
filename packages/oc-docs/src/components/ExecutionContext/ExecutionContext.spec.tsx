import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { ExecutionContext } from './ExecutionContext';
import type { ScriptChainStep } from '../../utils/request';
import type { AssertionRow } from '../../utils/assertions';
import type { TestRow } from '../../utils/fileUtils';

const scriptChain: ScriptChainStep[] = [
  { level: 'collection', phase: 'before-request', label: 'Collection Pre-Request', sourceName: 'API', code: 'bru.setVar("x", 1)', order: 0 },
  { level: 'request', phase: 'before-request', label: 'Request Pre-Request', code: 'console.log("go")', order: 1 },
  { level: 'request', phase: 'after-response', label: 'Request Post-Response', code: 'console.log("done")', order: 1 }
];

const assertions: AssertionRow[] = [
  { level: 'request', expression: 'res.status', operatorLabel: 'equals', value: '200', isUnary: false },
  { level: 'request', expression: 'res.body.token', operatorLabel: 'is defined', isUnary: true }
];

const tests: TestRow[] = [
  { level: 'collection', name: 'is authenticated', sourceName: 'API', code: "test('is authenticated', () => {})" },
  { level: 'request', name: 'returns a token', code: "test('returns a token', () => {})" }
];

describe('ExecutionContext', () => {
  it('composes the script chain (with HTTP marker), variables, asserts and tests', () => {
    const html = renderToStaticMarkup(
      <ExecutionContext
        scriptChain={scriptChain}
        preVars={[{ name: 'token', value: '{{authToken}}' }]}
        postVars={[{ name: 'sessionId', expression: 'res.body.id', scope: 'runtime' }]}
        assertions={assertions}
        tests={tests}
      />
    );
    expect(html).toContain('Scripts');
    expect(html).toContain('Collection Pre-Request');
    expect(html).toContain('HTTP');
    expect(html).toContain('Variables');
    expect(html).toContain('Pre-Request');
    expect(html).toContain('Post-Response');
    expect(html).toContain('sessionId');
    expect(html).toContain('res.body.id');
    expect(html).toContain('equals');
    expect(html).toContain('is defined');
    expect(html).toContain('returns a token');
    expect(html).toContain('View complete code');
  });

  it('shows the execution-flow chip from the schema (defaults to sandwich); no "inherited" tag', () => {
    const def = renderToStaticMarkup(
      <ExecutionContext scriptChain={scriptChain} preVars={[]} postVars={[]} assertions={[]} tests={[]} />
    );
    expect(def).toContain('Sandwich execution flow');
    expect(def).not.toContain('Sequential execution flow');
    expect(def).not.toContain('inherited');

    const seq = renderToStaticMarkup(
      <ExecutionContext scriptChain={scriptChain} preVars={[]} postVars={[]} assertions={[]} tests={[]} flow="sequential" />
    );
    expect(seq).toContain('Sequential execution flow');
    expect(seq).not.toContain('Sandwich execution flow');
  });

  it('omits per-section counts and offers a "View complete code" link', () => {
    const html = renderToStaticMarkup(
      <ExecutionContext
        scriptChain={[]}
        preVars={[{ name: 'token', value: 'x' }]}
        postVars={[]}
        assertions={assertions}
        tests={tests}
      />
    );
    expect(html).toContain('View complete code');
    // The "N vars / N asserts / N tests" count labels no longer appear in the headings.
    expect(html).not.toContain('2 asserts');
    expect(html).not.toContain('2 tests');
    expect(html).not.toContain('1 var');
  });

  it('gates each card independently — shows only Scripts and Variables when asserts/tests are absent', () => {
    const html = renderToStaticMarkup(
      <ExecutionContext
        scriptChain={scriptChain}
        preVars={[{ name: 'token', value: 'x' }]}
        postVars={[]}
        assertions={[]}
        tests={[]}
      />
    );
    expect(html).toContain('Scripts');
    expect(html).toContain('Variables');
    expect(html).not.toContain('Asserts');
    expect(html).not.toContain('>Tests<');
  });

  it('renders nothing when every section is empty', () => {
    const html = renderToStaticMarkup(
      <ExecutionContext scriptChain={[]} preVars={[]} postVars={[]} assertions={[]} tests={[]} />
    );
    expect(html).toBe('');
  });
});
