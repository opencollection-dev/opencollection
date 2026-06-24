import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { VariablesPanel } from './VariablesPanel';

describe('VariablesPanel', () => {
  it('renders nothing when there are no variables on either side', () => {
    expect(renderToStaticMarkup(<VariablesPanel preVars={[]} postVars={[]} />)).toBe('');
  });

  it('shows pre-request variables with their name and value', () => {
    const html = renderToStaticMarkup(
      <VariablesPanel preVars={[{ name: 'token', value: '{{authToken}}' }]} postVars={[]} />
    );
    expect(html).toContain('Pre-Request');
    expect(html).toContain('token');
    expect(html).toContain('authToken');
  });

  it('shows post-response captures with the expression they read from', () => {
    const html = renderToStaticMarkup(
      <VariablesPanel preVars={[]} postVars={[{ name: 'sessionId', expression: 'res.body.id', scope: 'runtime' }]} />
    );
    expect(html).toContain('Post Response');
    expect(html).toContain('sessionId');
    expect(html).toContain('res.body.id');
  });

  it('shows a "None." placeholder for the column that has no variables', () => {
    const html = renderToStaticMarkup(
      <VariablesPanel preVars={[{ name: 'token', value: 'x' }]} postVars={[]} />
    );
    expect(html).toContain('None.');
  });

  it('marks a disabled variable so it can be visually dimmed', () => {
    const html = renderToStaticMarkup(
      <VariablesPanel preVars={[{ name: 'legacy', value: 'v1', disabled: true }]} postVars={[]} />
    );
    expect(html).toContain('legacy');
    expect(html).toContain('property-row--disabled'); // PropertyTable's disabled-row class
  });
});
