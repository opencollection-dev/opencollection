import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, vi } from 'vitest';
import SidebarDrawer from './SidebarDrawer';

vi.mock('../../ui/Portal/Portal', () => ({
  Portal: ({ children }: { children: React.ReactNode }) => children
}));

const render = (open: boolean) =>
  renderToStaticMarkup(
    <SidebarDrawer open={open} onClose={() => {}}>
      <nav data-testid="drawer-child">tree</nav>
    </SidebarDrawer>
  );

describe('SidebarDrawer', () => {
  it('renders a modal dialog panel and a backdrop', () => {
    const html = render(true);
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('data-testid="sidebar-backdrop"');
  });

  it('renders its children', () => {
    expect(render(true)).toContain('data-testid="drawer-child"');
  });

  it('is open (class + aria-hidden false) when open', () => {
    const html = render(true);
    expect(html).toContain('open');
    expect(html).toContain('aria-hidden="false"');
  });

  it('is aria-hidden when closed', () => {
    expect(render(false)).toContain('aria-hidden="true"');
  });
});
