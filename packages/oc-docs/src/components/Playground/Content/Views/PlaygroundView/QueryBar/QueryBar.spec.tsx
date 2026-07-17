import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'node-html-parser';
import { describe, it, expect } from 'vitest';
import type { HttpRequest } from '@opencollection/types/requests/http';
import QueryBar from './QueryBar';
import { getByTestId } from '../../../../../../test-utils/dom';

const noop = () => {};

const render = (method: string) => {
  const item = { type: 'http', http: { method, url: 'https://api.test/v1' } } as unknown as HttpRequest;
  const html = renderToStaticMarkup(
    <QueryBar item={item} onSendRequest={noop} isLoading={false} onItemChange={noop} />
  );
  const root = parse(html);
  root.querySelectorAll('style').forEach((style) => style.remove());
  return root;
};

describe('QueryBar method selector', () => {
  it('shows the item method on the trigger with the method-select test id', () => {
    const trigger = getByTestId(render('POST'), 'method-select');
    expect(trigger.querySelector('.method-select-label')?.text).toBe('POST');
    expect(trigger.getAttribute('aria-label')).toBe('HTTP method');
  });

  it('colours a standard method with its method colour var', () => {
    const trigger = getByTestId(render('POST'), 'method-select');
    expect(trigger.getAttribute('style')).toContain('color:var(--oc-request-methods-post)');
  });

  it('renders a non-standard method verbatim in the muted colour', () => {
    const trigger = getByTestId(render('PURGE'), 'method-select');
    expect(trigger.querySelector('.method-select-label')?.text).toBe('PURGE');
    expect(trigger.getAttribute('style')).toContain('color:var(--oc-colors-text-muted)');
  });

  it('keeps the trigger label truncatable and exposes the full method in the title', () => {
    const method = 'AVERYLONGCUSTOMMETHODNAME';
    const trigger = getByTestId(render(method), 'method-select');
    expect(trigger.querySelector('.method-select-label')?.text).toBe(method);
    expect(trigger.getAttribute('title')).toBe(method);
  });
});
