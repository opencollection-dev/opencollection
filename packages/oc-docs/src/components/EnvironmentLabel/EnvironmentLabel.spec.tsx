import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { EnvironmentLabel } from './EnvironmentLabel';

describe('EnvironmentLabel', () => {
  it('renders the environment name', () => {
    const html = renderToStaticMarkup(<EnvironmentLabel name="Development" />);
    expect(html).toContain('Development');
    expect(html).toContain('environment-label-dot');
  });

  it('applies the environment color to the dot', () => {
    const html = renderToStaticMarkup(<EnvironmentLabel name="Prod" color="#dc2626" />);
    expect(html).toContain('#dc2626');
  });

  it('forwards custom class names', () => {
    const html = renderToStaticMarkup(
      <EnvironmentLabel name="Staging" className="env-tab" nameClassName="env-tab-name" />
    );
    expect(html).toContain('env-tab');
    expect(html).toContain('env-tab-name');
  });
});
