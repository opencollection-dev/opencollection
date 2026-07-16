import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../../../../../hooks/useRenderToDom';
import { query, getByTestId, queryByTestId } from '../../../../../../test-utils/dom';
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

  it('renders the default title and a provided description', () => {
    const root = useRenderToDom(
      <HeadersTab headers={[]} onHeadersChange={noop} description="Request headers sent with the call" />
    );
    expect(query(root, '.title').text.trim()).toBe('Headers');
    expect(query(root, '.description').text.trim()).toBe('Request headers sent with the call');
    expect(queryByTestId(root, 'bulk-edit-toggle')).toBeTruthy();
  });

  it('exposes the Bulk edit toggle button', () => {
    const root = useRenderToDom(<HeadersTab headers={[]} onHeadersChange={noop} />);
    expect(getByTestId(root, 'bulk-edit-toggle').text.trim()).toBe('Bulk edit');
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
