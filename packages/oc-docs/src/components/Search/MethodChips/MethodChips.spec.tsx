import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { MethodChips } from './MethodChips';

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

describe('MethodChips', () => {
  it('renders a chip per method, abbreviating DELETE and OPTIONS', () => {
    const html = renderToStaticMarkup(<MethodChips methods={methods} active={new Set()} onToggle={() => {}} />);
    for (const label of ['GET', 'POST', 'PUT', 'PATCH', 'DEL', 'OPT']) {
      expect(html).toContain(`>${label}<`);
    }
  });

  it('marks active methods as pressed (DEL maps to DELETE)', () => {
    const html = renderToStaticMarkup(<MethodChips methods={methods} active={new Set(['DELETE'])} onToggle={() => {}} />);
    expect(html).toMatch(/aria-pressed="true"[^>]*>DEL</);
    expect(html).toMatch(/aria-pressed="false"[^>]*>GET</);
  });

  it('renders no chips when the collection has no methods', () => {
    const html = renderToStaticMarkup(<MethodChips methods={[]} active={new Set()} onToggle={() => {}} />);
    expect(html).not.toContain('<button');
  });
});
