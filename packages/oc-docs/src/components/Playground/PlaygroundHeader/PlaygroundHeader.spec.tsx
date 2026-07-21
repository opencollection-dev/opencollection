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

  it('marks the sidebar toggle pressed and fills the icon when the sidebar is open', () => {
    const html = renderToStaticMarkup(
      <PlaygroundHeader dock="bottom" onDockChange={noop} onToggleSidebar={noop} onClose={noop} sidebarOpen />
    );
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('fill="currentColor"');
  });

  it('leaves the sidebar toggle unpressed and the icon unfilled when the sidebar is closed', () => {
    const html = renderToStaticMarkup(
      <PlaygroundHeader dock="bottom" onDockChange={noop} onToggleSidebar={noop} onClose={noop} />
    );
    expect(html).toContain('aria-pressed="false"');
    expect(html).not.toContain('fill="currentColor"');
  });
});
