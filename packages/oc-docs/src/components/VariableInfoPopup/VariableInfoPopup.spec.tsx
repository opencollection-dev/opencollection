import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { VariableInfoPopup } from './VariableInfoPopup';
import { SECRET_MASK } from '../../ui/SecretValue/SecretValue';

describe('VariableInfoPopup', () => {
  it('shows the variable name, scope and value', () => {
    const html = renderToStaticMarkup(
      <VariableInfoPopup
        name="host"
        info={{ name: 'host', scope: 'environment', scopeLabel: 'Environment', value: 'http://localhost:8081', secret: false }}
      />
    );
    expect(html).toContain('host');
    expect(html).toContain('Environment');
    expect(html).toContain('http://localhost:8081');
  });

  it('renders a copy button for a non-secret value', () => {
    const html = renderToStaticMarkup(
      <VariableInfoPopup name="host" info={{ name: 'host', scope: 'environment', scopeLabel: 'Environment', value: 'http://localhost:8081', secret: false }} />
    );
    expect(html).toContain('variable-info-copy');
  });

  it('masks a secret value, never renders it, and omits the copy button', () => {
    const html = renderToStaticMarkup(
      <VariableInfoPopup name="token" info={{ name: 'token', scope: 'environment', scopeLabel: 'Environment', value: 's3cr3t', secret: true }} />
    );
    expect(html).toContain(SECRET_MASK);
    expect(html).not.toContain('s3cr3t');
    expect(html).not.toContain('variable-info-copy');
  });

  it('renders the value box (empty) for a defined variable with no value', () => {
    const html = renderToStaticMarkup(
      <VariableInfoPopup name="empty" info={{ name: 'empty', scope: 'collection', scopeLabel: 'Collection', value: '', secret: false }} />
    );
    expect(html).toContain('var-value-display');
    expect(html).toContain('Collection');
  });

  it('shows a "not defined" note when the variable is unresolved', () => {
    const html = renderToStaticMarkup(<VariableInfoPopup name="unknown" info={null} />);
    expect(html).toContain('unknown');
    expect(html).toContain('Not defined');
  });
});
