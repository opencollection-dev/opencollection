import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { ViewAllTests } from './ViewAllTests';
import type { RawTestScript } from '../../../utils/fileUtils';

const withCode: RawTestScript[] = [{ level: 'request', code: "const x = 1;\ntest('t1', () => { runIt(); })" }];
const noCode: RawTestScript[] = [{ level: 'request', code: '   ' }];

describe('ViewAllTests', () => {
  it('renders nothing when no script has source to show', () => {
    expect(renderToStaticMarkup(<ViewAllTests scripts={noCode} />)).toBe('');
    expect(renderToStaticMarkup(<ViewAllTests scripts={[]} />)).toBe('');
  });

  it('shows a "View complete code" trigger when scripts have source', () => {
    expect(renderToStaticMarkup(<ViewAllTests scripts={withCode} />)).toContain('View complete code');
  });

  it('keeps the code modal closed until the trigger is activated', () => {
    const html = renderToStaticMarkup(<ViewAllTests scripts={withCode} />);
    // The combined source only renders inside the (closed) modal, so it is absent here.
    expect(html).not.toContain('runIt()');
  });
});
