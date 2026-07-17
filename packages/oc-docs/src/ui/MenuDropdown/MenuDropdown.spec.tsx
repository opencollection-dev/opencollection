import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import MenuDropdown from './MenuDropdown';
import type { MenuDropdownItem } from './types';

const items: MenuDropdownItem[] = [
  { id: 'copy', label: 'Copy', onClick: () => {} },
  { id: 'delete', label: 'Delete', onClick: () => {} }
];

describe('MenuDropdown', () => {
  it('renders the trigger element with the menu closed by default', () => {
    const html = renderToStaticMarkup(
      <MenuDropdown items={items}>
        <button type="button">Actions</button>
      </MenuDropdown>
    );
    expect(html).toContain('Actions');
    expect(html).toContain('aria-expanded="false"');
    // Closed menu: the popover content is not rendered.
    expect(html).not.toContain('role="menu"');
  });

  it('forwards the data-testid to the trigger', () => {
    const html = renderToStaticMarkup(
      <MenuDropdown items={items} data-testid="row-actions">
        <button type="button">Actions</button>
      </MenuDropdown>
    );
    expect(html).toContain('data-testid="row-actions"');
  });

  it('renders a plain wrapper trigger when children is not a single element', () => {
    const html = renderToStaticMarkup(<MenuDropdown items={items}>Actions</MenuDropdown>);
    expect(html).toContain('data-testid="menu-dropdown"');
    expect(html).toContain('Actions');
  });

  it('renders a default trigger showing the selected item when no children are provided', () => {
    const html = renderToStaticMarkup(<MenuDropdown items={items} selectedItemId="delete" />);
    // Default trigger shows the selected item's label (via the label fallback).
    expect(html).toContain('Delete');
    expect(html).toContain('menu-dropdown-trigger');
  });

  it('uses itemToText to derive the default trigger text', () => {
    const html = renderToStaticMarkup(
      <MenuDropdown items={items} selectedItemId="copy" itemToText={(item) => `Format: ${item.label}`} />
    );
    expect(html).toContain('Format: Copy');
  });
});
