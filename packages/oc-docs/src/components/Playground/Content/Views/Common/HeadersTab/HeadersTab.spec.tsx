import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../../../../../hooks/useRenderToDom';
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

  it('renders a provided title and description', () => {
    const root = useRenderToDom(
      <HeadersTab headers={[]} onHeadersChange={noop} title="Headers" description="Request headers sent with the call" />
    );
    expect(root.querySelector('.title')?.text.trim()).toBe('Headers');
    expect(root.querySelector('.description')?.text.trim()).toBe('Request headers sent with the call');
    expect(root.querySelector('[data-testid="bulk-edit-toggle"]')).toBeTruthy();
  });

  it('exposes the Bulk edit toggle button', () => {
    const root = useRenderToDom(<HeadersTab headers={[]} onHeadersChange={noop} />);
    expect(root.querySelector('[data-testid="bulk-edit-toggle"]')?.text.trim()).toBe('Bulk edit');
  });
});
