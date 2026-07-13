import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { ScriptChain } from './ScriptChain';
import type { ScriptChainStep } from '@utils/request';

const postChain: ScriptChainStep[] = [
  { level: 'collection', phase: 'after-response', label: 'Collection Post-Response', code: 'a', order: 0 },
  { level: 'folder', phase: 'after-response', label: 'Folder Post-Response', code: 'b', order: 1 },
  { level: 'request', phase: 'after-response', label: 'Request Post-Response', code: 'c', order: 2 }
];

const orderOf = (html: string, ...labels: string[]) => labels.map((l) => html.indexOf(l));
const isAscending = (xs: number[]) => xs.every((x, i) => i === 0 || (x > xs[i - 1] && x >= 0));

describe('ScriptChain', () => {
  it('renders nothing when there are no steps', () => {
    expect(renderToStaticMarkup(<ScriptChain steps={[]} flow="sandwich" />)).toBe('');
  });

  it('sandwich flow runs post-response innermost→outermost (request → folder → collection)', () => {
    const html = renderToStaticMarkup(<ScriptChain steps={postChain} flow="sandwich" />);
    expect(isAscending(orderOf(html, 'Request Post-Response', 'Folder Post-Response', 'Collection Post-Response'))).toBe(true);
  });

  it('sequential flow runs post-response outermost→innermost (collection → folder → request)', () => {
    const html = renderToStaticMarkup(<ScriptChain steps={postChain} flow="sequential" />);
    expect(isAscending(orderOf(html, 'Collection Post-Response', 'Folder Post-Response', 'Request Post-Response'))).toBe(true);
  });

  it('runs pre-request steps collection → folder → request in both flows', () => {
    const pre: ScriptChainStep[] = [
      { level: 'collection', phase: 'before-request', label: 'Collection Pre-Request', code: 'a', order: 0 },
      { level: 'folder', phase: 'before-request', label: 'Folder Pre-Request', code: 'b', order: 1 },
      { level: 'request', phase: 'before-request', label: 'Request Pre-Request', code: 'c', order: 2 }
    ];
    for (const flow of ['sandwich', 'sequential'] as const) {
      const html = renderToStaticMarkup(<ScriptChain steps={pre} flow={flow} />);
      expect(isAscending(orderOf(html, 'Collection Pre-Request', 'Folder Pre-Request', 'Request Pre-Request'))).toBe(true);
    }
  });

  it('numbers every row 1..N in display order, including the HTTP marker', () => {
    const html = renderToStaticMarkup(<ScriptChain steps={postChain} flow="sandwich" url="http://x" method="POST" />);
    expect(html).toContain('HTTP');
    // 3 post-response steps + 1 marker → positions 1..4 are present.
    ['>1<', '>2<', '>3<', '>4<'].forEach((n) => expect(html).toContain(n));
  });

  it('shows the request URL beside the HTTP marker when provided', () => {
    const html = renderToStaticMarkup(<ScriptChain steps={postChain} flow="sandwich" url="{{baseUrl}}/login" />);
    expect(html).toContain('/login');
  });

  it('shows the HTTP marker label even when no URL is given', () => {
    const html = renderToStaticMarkup(<ScriptChain steps={postChain} flow="sandwich" />);
    expect(html).toContain('HTTP');
  });

  it('numbers pre-request steps, the HTTP marker, then post-response steps consecutively', () => {
    const mixed: ScriptChainStep[] = [
      { level: 'collection', phase: 'before-request', label: 'Collection Pre-Request', code: 'a', order: 0 },
      { level: 'request', phase: 'before-request', label: 'Request Pre-Request', code: 'b', order: 1 },
      { level: 'request', phase: 'after-response', label: 'Request Post-Response', code: 'c', order: 1 }
    ];
    const html = renderToStaticMarkup(<ScriptChain steps={mixed} flow="sandwich" url="http://x" />);
    // 2 pre-request steps + 1 marker + 1 post-response step → positions 1..4.
    ['>1<', '>2<', '>3<', '>4<'].forEach((n) => expect(html).toContain(n));
    // The marker sits between the pre-request and post-response steps.
    expect(isAscending(orderOf(html, 'Request Pre-Request', 'HTTP', 'Request Post-Response'))).toBe(true);
  });
});
