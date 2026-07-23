import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../../../../../hooks/useRenderToDom';
import { query } from '../../../../../../test-utils/dom';
import { HeadersTab } from './HeadersTab';

const noop = () => {};

describe('HeadersTab', () => {
  it('renders the header names and values in the key/value table', () => {
    const root = useRenderToDom(
      <HeadersTab
        headers={[
          { name: 'Content-Type', value: 'application/json' },
          { name: 'Accept', value: 'text/html' }
        ]}
        onHeadersChange={noop}
      />
    );
    const values = root.querySelectorAll('input.text-input').map((input) => input.getAttribute('value'));
    expect(values).toContain('Content-Type');
    expect(values).toContain('application/json');
    expect(values).toContain('Accept');
    expect(values).toContain('text/html');
  });

  it('renders the provided description with no standalone title heading', () => {
    const root = useRenderToDom(
      <HeadersTab
        headers={[]}
        onHeadersChange={noop}
        description="Request headers sent with the call"
      />
    );
    // With no title prop, the tab shows only the description — no separate title heading.
    expect(root.querySelector('.title')).toBeNull();
    expect(query(root, '.description').text.trim()).toBe('Request headers sent with the call');
    expect(root.querySelector('[data-testid="bulk-edit-toggle"]')).toBeTruthy();
  });

  it('exposes the Bulk edit toggle button', () => {
    const root = useRenderToDom(<HeadersTab headers={[]} onHeadersChange={noop} />);
    expect(query(root, '[data-testid="bulk-edit-toggle"]').text.trim()).toBe('Bulk edit');
  });

  it('flags a header name with spaces and a value with newlines', () => {
    const root = useRenderToDom(
      <HeadersTab headers={[{ name: 'Bad Name', value: 'line1\nline2' }]} onHeadersChange={noop} />
    );
    expect(root.querySelector('[aria-label="Header name cannot contain spaces or newlines"]')).toBeTruthy();
    expect(root.querySelector('[aria-label="Header value cannot contain newlines"]')).toBeTruthy();
  });

  it('shows no error for a valid header', () => {
    const root = useRenderToDom(
      <HeadersTab headers={[{ name: 'Content-Type', value: 'application/json' }]} onHeadersChange={noop} />
    );
    expect(root.querySelector('.cell-error')).toBeNull();
  });
});
