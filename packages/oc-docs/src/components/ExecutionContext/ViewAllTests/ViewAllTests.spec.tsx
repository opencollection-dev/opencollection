import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { ViewAllTests } from './ViewAllTests';
import type { TestRow } from '../../../utils/fileUtils';

const withCode: TestRow[] = [{ level: 'request', name: 't1', code: "test('t1', () => { runIt(); })" }];
const noCode: TestRow[] = [{ level: 'request', name: 't1', code: '   ' }];

describe('ViewAllTests', () => {
  it('renders nothing when no test has source to show', () => {
    expect(renderToStaticMarkup(<ViewAllTests tests={noCode} />)).toBe('');
  });

  it('shows a "View complete code" trigger when tests have source', () => {
    expect(renderToStaticMarkup(<ViewAllTests tests={withCode} />)).toContain('View complete code');
  });

  it('keeps the code modal closed until the trigger is activated', () => {
    const html = renderToStaticMarkup(<ViewAllTests tests={withCode} />);
    // The combined source only renders inside the (closed) modal, so it is absent here.
    expect(html).not.toContain('runIt()');
  });
});
