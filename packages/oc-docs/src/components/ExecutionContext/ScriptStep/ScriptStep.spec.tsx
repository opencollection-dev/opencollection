import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { ScriptStep } from './ScriptStep';
import type { ScriptChainStep } from '../../../utils/requestScripts';

const step: ScriptChainStep = {
  level: 'request',
  phase: 'before-request',
  label: 'Request Pre-Request',
  code: 'console.log("run")',
  order: 0
};

describe('ScriptStep', () => {
  it('shows the 1-based position number and the step label', () => {
    const html = renderToStaticMarkup(<ScriptStep step={step} position={3} />);
    expect(html).toContain('>3<'); // the number is the sole content of the step-number cell
    expect(html).toContain('Request Pre-Request');
  });

  it('offers a keyboard-operable, collapsed-by-default "view code" toggle', () => {
    const html = renderToStaticMarkup(<ScriptStep step={step} position={1} />);
    expect(html).toContain('view code');
    expect(html).toContain('role="button"');
    expect(html).toContain('aria-expanded="false"');
  });

  it('does not render the source until the step is expanded (lazy panel)', () => {
    const html = renderToStaticMarkup(<ScriptStep step={step} position={1} />);
    expect(html).not.toContain('console.log("run")');
  });
});
