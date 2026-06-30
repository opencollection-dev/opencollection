import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  it('renders the trigger label with the menu closed by default', () => {
    const html = renderToStaticMarkup(
      <Dropdown label="Folder" menuLabel="Filter by folder">
        {() => <li>option</li>}
      </Dropdown>,
    );
    expect(html).toContain('Folder');
    expect(html).toContain('aria-expanded="false"');
    expect(html).not.toContain('role="listbox"');
    expect(html).not.toContain('dropdown-button is-active');
  });

  it('marks the trigger active when a value is selected', () => {
    const html = renderToStaticMarkup(
      <Dropdown label="Rooms" active menuLabel="Filter by folder">
        {() => null}
      </Dropdown>,
    );
    expect(html).toContain('dropdown-button is-active');
  });
});
