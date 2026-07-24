import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import SidebarNavLink from './SidebarNavLink';

describe('SidebarNavLink', () => {
  it('renders the label inside a navigate button', () => {
    const html = renderToStaticMarkup(<SidebarNavLink label="Overview" />);
    expect(html).toContain('Overview');
    expect(html).toContain('<button');
    expect(html).toContain('navlink-main');
  });

  it('applies the active class when active', () => {
    expect(renderToStaticMarkup(<SidebarNavLink label="Hotels" active />)).toContain('active');
  });

  it('renders a text-only method label colored by the shared method var (DELETE to DEL)', () => {
    const html = renderToStaticMarkup(<SidebarNavLink label="Cancel Booking" method="DELETE" />);
    expect(html).toContain('DEL');
    expect(html).toContain('var(--oc-request-methods-delete)');
    expect(html).toContain('navlink-method');
  });

  it('renders an icon slot when given an icon', () => {
    const html = renderToStaticMarkup(
      <SidebarNavLink label="Environments" icon={<svg data-testid="globe" />} />
    );
    expect(html).toContain('navlink-icon');
    expect(html).toContain('data-testid="globe"');
  });

  it('renders a chevron slot for folders', () => {
    const html = renderToStaticMarkup(
      <SidebarNavLink label="Authentication" chevron={<svg data-testid="chev" />} />
    );
    expect(html).toContain('data-testid="chev"');
  });

  it('forwards slug and testId to data attributes', () => {
    const html = renderToStaticMarkup(
      <SidebarNavLink label="Login" slug="auth/login" testId="sidebar-item" />
    );
    expect(html).toContain('data-slug="auth/login"');
    expect(html).toContain('data-testid="sidebar-item"');
  });

  it('renders a JS badge in the method column for script rows, label stays default font', () => {
    const html = renderToStaticMarkup(<SidebarNavLink label="setup.js" script />);
    expect(html).toContain('navlink-method');
    expect(html).toContain('>JS<');
    expect(html).not.toContain('navlink-label mono');
  });

  it('indents by level via margin (one 19px chevron+gap step per level) with a uniform 8px inner pad', () => {
    const html = renderToStaticMarkup(<SidebarNavLink label="Nested" level={2} />);
    // Each level is one 19px chevron+gap step: level*19 = 38px -> 38/16 = 2.375rem margin.
    // The 8px (0.5rem) pad is uniform across folders and leaves so glyphs line up
    // under their parent.
    expect(html).toContain('margin-left:2.375rem');
    expect(html).toContain('padding-left:0.5rem');
  });
});
