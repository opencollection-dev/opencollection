import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import EnvVarCards from './EnvVarCards';
import type { KeyValueRow } from '../../../../../../components/KeyValueTable/KeyValueTable';

const rows: KeyValueRow[] = [
  { id: '1', name: 'host', value: '', enabled: true },
  { id: '2', name: 'token', value: '', enabled: true, secret: true }
];

describe('EnvVarCards', () => {
  it('renders name/value test ids and placeholders for editable rows', () => {
    const html = renderToStaticMarkup(<EnvVarCards rows={rows} onChange={() => undefined} />);
    expect(html).toContain('data-testid="env-var-name-0"');
    expect(html).toContain('data-testid="env-var-value-0"');
    expect(html).toContain('placeholder="Name"');
    expect(html).toContain('placeholder="Value"');
  });

  it('renders a secret row as a masked input with a Value placeholder', () => {
    const html = renderToStaticMarkup(<EnvVarCards rows={rows} onChange={() => undefined} />);
    expect(html).toContain('type="password"');
    expect(html).toContain('placeholder="Value"');
  });
});
