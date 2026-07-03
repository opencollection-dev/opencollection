import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { TestList } from './TestList';
import type { TestRow } from '../../../utils/fileUtils';

const tests: TestRow[] = [
  { level: 'collection', name: 'is authenticated', sourceName: 'API', code: "test('is authenticated', () => { expect(ok).to.equal(true); })" },
  { level: 'request', name: 'returns a token', code: '' }
];

describe('TestList', () => {
  it('renders nothing when there are no tests', () => {
    expect(renderToStaticMarkup(<TestList tests={[]} />)).toBe('');
  });

  it('lists each test with its scope pill and name', () => {
    const html = renderToStaticMarkup(<TestList tests={tests} />);
    expect(html).toContain('collection');
    expect(html).toContain('is authenticated');
    expect(html).toContain('returns a token');
  });

  it('shows a "view code" toggle for a test that has source', () => {
    expect(renderToStaticMarkup(<TestList tests={[tests[0]]} />)).toContain('view code');
  });

  it('does not offer a toggle, and is not interactive, for a test with no source', () => {
    const html = renderToStaticMarkup(<TestList tests={[tests[1]]} />);
    expect(html).not.toContain('view code');
    // a non-expandable row must not advertise itself as a button to assistive tech
    expect(html).not.toContain('role="button"');
  });

  it('treats whitespace-only source as empty (no toggle)', () => {
    const html = renderToStaticMarkup(<TestList tests={[{ level: 'request', name: 'blank', code: '   \n  ' }]} />);
    expect(html).toContain('blank');
    expect(html).not.toContain('view code');
  });

  it('keeps a test\'s source collapsed until it is expanded (lazy)', () => {
    expect(renderToStaticMarkup(<TestList tests={[tests[0]]} />)).not.toContain('expect(ok).to.equal(true)');
  });

  it('does not show the collection or folder name on a test row, since the scope pill already indicates the level', () => {
    const html = renderToStaticMarkup(<TestList tests={[tests[0]]} />);
    expect(html).not.toContain('test-source');
  });

  it('renders a raw-script row (no test()/it() wrapper) with a view-code toggle', () => {
    const raw: TestRow[] = [{ level: 'request', name: 'Test script', raw: true, code: 'expect(res.status).to.equal(200);' }];
    const html = renderToStaticMarkup(<TestList tests={raw} />);
    expect(html).toContain('Test script');
    expect(html).toContain('test-name--raw');
    expect(html).toContain('view code'); // raw scripts are still viewable
  });
});
