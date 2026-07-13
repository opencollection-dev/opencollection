import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { FolderFilter } from './FolderFilter';
import type { FolderOption } from '@components/Search/searchIndex';

const folders: FolderOption[] = [
  { slug: 'hotels', name: 'Hotels' },
  { slug: 'bookings', name: 'Bookings' },
];

describe('FolderFilter', () => {
  it('shows the neutral "Folder" label when nothing is selected', () => {
    const html = renderToStaticMarkup(<FolderFilter folders={folders} value={null} onChange={() => {}} />);
    expect(html).toContain('Folder');
    expect(html).not.toContain('dropdown-button is-active');
  });

  it('shows the selected folder name and an active state', () => {
    const html = renderToStaticMarkup(<FolderFilter folders={folders} value="hotels" onChange={() => {}} />);
    expect(html).toContain('Hotels');
    expect(html).toContain('dropdown-button is-active');
  });

  it('renders nothing when the collection has no folders', () => {
    const html = renderToStaticMarkup(<FolderFilter folders={[]} value={null} onChange={() => {}} />);
    expect(html).toBe('');
  });
});
