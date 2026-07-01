import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { describe, it, expect } from 'vitest';
import SidebarFooter from './SidebarFooter';
import { createOpenCollectionStore } from '../../../../store/store';

const render = () =>
  renderToStaticMarkup(
    <Provider store={createOpenCollectionStore()}>
      <SidebarFooter />
    </Provider>
  );

describe('SidebarFooter', () => {
  it('renders the Powered by attribution', () => {
    expect(render()).toContain('Powered by');
  });

  it('renders the OpenCollection wordmark linking to opencollection.com', () => {
    const html = render();
    expect(html).toContain('aria-label="OpenCollection"');
    expect(html).toContain('href="https://opencollection.com"');
  });

  it('includes the theme toggle', () => {
    const html = render();
    expect(html).toContain('data-testid="sidebar-footer"');
    expect(html).toMatch(/aria-label="[^"]*(theme|mode)[^"]*"/i);
  });
});
