import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import PlaygroundHeader from './PlaygroundHeader';

const noop = () => undefined;

describe('PlaygroundHeader', () => {
  it('renders the dock switcher by default', () => {
    const html = renderToStaticMarkup(
      <PlaygroundHeader dock="bottom" onDockChange={noop} onToggleSidebar={noop} onClose={noop} />
    );
    expect(html).toContain('playground-dock-switcher');
    expect(html).toContain('playground-close');
  });

  it('hides the dock switcher when showDockSwitcher is false', () => {
    const html = renderToStaticMarkup(
      <PlaygroundHeader dock="bottom" onDockChange={noop} onToggleSidebar={noop} onClose={noop} showDockSwitcher={false} />
    );
    expect(html).not.toContain('playground-dock-switcher');
    expect(html).toContain('playground-sidebar-toggle');
    expect(html).toContain('playground-close');
  });
});
