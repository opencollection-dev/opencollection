import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { ExecutionContext } from './ExecutionContext';
import { ScriptChain } from './ScriptChain';
import type { ScriptChainStep } from '../../utils/requestScripts';
import type { AssertionRow } from '../../utils/assertions';
import type { TestRow } from '../../utils/extractTests';

const scriptChain: ScriptChainStep[] = [
  { level: 'collection', phase: 'before-request', label: 'Collection Pre-Request', sourceName: 'API', code: 'bru.setVar("x", 1)', order: 0 },
  { level: 'request', phase: 'before-request', label: 'Request Pre-Request', code: 'console.log("go")', order: 1 },
  { level: 'request', phase: 'after-response', label: 'Request Post-Response', code: 'console.log("done")', order: 1 }
];

// Collection + folder + request post-response steps, used to assert ordering.
const postChain: ScriptChainStep[] = [
  { level: 'collection', phase: 'after-response', label: 'Collection Post-Response', code: 'a', order: 0 },
  { level: 'folder', phase: 'after-response', label: 'Folder Post-Response', code: 'b', order: 1 },
  { level: 'request', phase: 'after-response', label: 'Request Post-Response', code: 'c', order: 2 }
];

const assertions: AssertionRow[] = [
  { level: 'request', expression: 'res.status', operatorLabel: 'equals', value: '200', isUnary: false },
  { level: 'request', expression: 'res.body.token', operatorLabel: 'is defined', isUnary: true }
];

const tests: TestRow[] = [
  { level: 'collection', name: 'is authenticated', sourceName: 'API', code: "test('is authenticated', () => {})" },
  { level: 'request', name: 'returns a token', code: "test('returns a token', () => {})" }
];

const order = (html: string, ...labels: string[]) => labels.map((l) => html.indexOf(l));
const isAscending = (xs: number[]) => xs.every((x, i) => i === 0 || (x > xs[i - 1] && x >= 0));

describe('ExecutionContext', () => {
  it('renders the script chain with an HTTP marker, vars, asserts and tests', () => {
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
    expect(html).toContain('2 asserts');
    expect(html).toContain('equals');
    expect(html).toContain('is defined');
    expect(html).toContain('2 tests');
    expect(html).toContain('returns a token');
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

  it('uses singular nouns for a single assert/test', () => {
    const html = renderToStaticMarkup(
      <ExecutionContext
        scriptChain={[]}
        preVars={[]}
        postVars={[]}
        assertions={[assertions[0]]}
        tests={[tests[1]]}
      />
    );
    expect(html).toContain('1 assert');
    expect(html).not.toContain('1 asserts');
    expect(html).toContain('1 test');
    expect(html).not.toContain('1 tests');
  });

  it('renders nothing when everything is empty', () => {
    const html = renderToStaticMarkup(
      <ExecutionContext scriptChain={[]} preVars={[]} postVars={[]} assertions={[]} tests={[]} />
    );
    expect(html).toBe('');
  });
});

describe('ScriptChain ordering', () => {
  it('sandwich: post-response runs innermost→outermost (request → folder → collection)', () => {
    const html = renderToStaticMarkup(<ScriptChain steps={postChain} flow="sandwich" />);
    expect(isAscending(order(html, 'Request Post-Response', 'Folder Post-Response', 'Collection Post-Response'))).toBe(true);
  });

  it('sequential: post-response runs outermost→innermost (collection → folder → request)', () => {
    const html = renderToStaticMarkup(<ScriptChain steps={postChain} flow="sequential" />);
    expect(isAscending(order(html, 'Collection Post-Response', 'Folder Post-Response', 'Request Post-Response'))).toBe(true);
  });

  it('pre-request runs collection → folder → request in both flows', () => {
    const pre: ScriptChainStep[] = [
      { level: 'collection', phase: 'before-request', label: 'Collection Pre-Request', code: 'a', order: 0 },
      { level: 'folder', phase: 'before-request', label: 'Folder Pre-Request', code: 'b', order: 1 },
      { level: 'request', phase: 'before-request', label: 'Request Pre-Request', code: 'c', order: 2 }
    ];
    for (const flow of ['sandwich', 'sequential'] as const) {
      const html = renderToStaticMarkup(<ScriptChain steps={pre} flow={flow} />);
      expect(isAscending(order(html, 'Collection Pre-Request', 'Folder Pre-Request', 'Request Pre-Request'))).toBe(true);
    }
  });

  it('numbers rows 1..N in display order, HTTP marker included', () => {
    const html = renderToStaticMarkup(<ScriptChain steps={postChain} flow="sandwich" url="http://x" method="POST" />);
    expect(html).toContain('HTTP');
    // 3 post steps + 1 marker → positions 1..4 present.
    ['>1<', '>2<', '>3<', '>4<'].forEach((n) => expect(html).toContain(n));
  });
});
