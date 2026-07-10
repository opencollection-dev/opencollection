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
    expect(html).toContain('Post-Response');
    expect(html).toContain('sessionId');
    expect(html).toContain('res.body.id');
  });

  it('shows a "None." placeholder for the column that has no variables', () => {
    const html = renderToStaticMarkup(
      <VariablesPanel preVars={[{ name: 'token', value: 'x' }]} postVars={[]} />
    );
    expect(html).toContain('None.');
  });

  it('shows a variable description below its value', () => {
    const html = renderToStaticMarkup(
      <VariablesPanel
        preVars={[{ name: 'sessionId', value: '{{$randomUUID}}', description: 'Unique session identifier' }]}
        postVars={[{ name: 'authToken', expression: 'res.body.token', description: 'JWT access token' }]}
      />
    );
    expect(html).toContain('Unique session identifier');
    expect(html).toContain('JWT access token');
  });

  it('marks a disabled variable so it can be visually dimmed', () => {
    const html = renderToStaticMarkup(
      <VariablesPanel preVars={[{ name: 'legacy', value: 'v1', disabled: true }]} postVars={[]} />
    );
    expect(html).toContain('legacy');
    expect(html).toContain('property-row--disabled'); // PropertyTable's disabled-row class
  });

  describe('stacked variant (overview)', () => {
    it('applies the vars-stacked class', () => {
      const html = renderToStaticMarkup(
        <VariablesPanel preVars={[{ name: 'token', value: 'x' }]} postVars={[]} variant="stacked" />
      );
      expect(html).toContain('vars-stacked');
    });

    it('omits the empty side entirely (no Post-Response table / "None." placeholder)', () => {
      const html = renderToStaticMarkup(
        <VariablesPanel preVars={[{ name: 'token', value: 'x' }]} postVars={[]} variant="stacked" />
      );
      expect(html).toContain('Pre-Request');
      expect(html).not.toContain('Post-Response');
      expect(html).not.toContain('None.');
    });

    it('omits the Pre-Request side when only post-response captures exist', () => {
      const html = renderToStaticMarkup(
        <VariablesPanel preVars={[]} postVars={[{ name: 'sessionId', expression: 'res.body.id' }]} variant="stacked" />
      );
      expect(html).toContain('Post-Response');
      expect(html).not.toContain('Pre-Request');
      expect(html).not.toContain('None.');
    });

    it('shows both tables, labelled "Pre-Request" / "Post-Response" in the overview page', () => {
      const html = renderToStaticMarkup(
        <VariablesPanel
          preVars={[{ name: 'token', value: 'x' }]}
          postVars={[{ name: 'sessionId', expression: 'res.body.id' }]}
          variant="stacked"
        />
      );
      expect(html).toContain('Pre-Request');
      expect(html).toContain('Post-Response');
      expect(html).not.toContain('None.');
    });
  });
});
