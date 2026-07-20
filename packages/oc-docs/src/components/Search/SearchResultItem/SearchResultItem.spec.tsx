import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { SearchResultItem } from './SearchResultItem';
import type { SearchRecord } from '../searchIndex';

const record: SearchRecord = {
  id: 'u1',
  slug: 'hotels/get-all',
  name: 'Get All Hotels',
  method: 'GET',
  breadcrumb: 'Hotels / Browse & search',
  ancestorSlugs: ['hotels'],
  url: '{{baseUrl}}/api/v1/hotels',
};

describe('SearchResultItem', () => {
  it('renders method label, name, breadcrumb and url', () => {
    const html = renderToStaticMarkup(<SearchResultItem record={record} onSelect={() => {}} />);
    expect(html).toContain('GET');
    expect(html).toContain('Get All Hotels');
    expect(html).toContain('Hotels / Browse &amp; search');
    expect(html).toContain('/api/v1/hotels');
  });

  it('omits the url line when there is no url', () => {
    const html = renderToStaticMarkup(<SearchResultItem record={{ ...record, url: '' }} onSelect={() => {}} />);
    expect(html).not.toContain('class="search-result-url"');
  });

  it('bolds the matched ranges reported for a field', () => {
    // "Hotels" sits at indices 8-13 of "Get All Hotels".
    const html = renderToStaticMarkup(
      <SearchResultItem record={record} matches={{ name: [[8, 13]] }} onSelect={() => {}} />,
    );
    expect(html).toContain('<b class="search-hl">Hotels</b>');
  });

  it('renders plain text when a field has no matches', () => {
    const html = renderToStaticMarkup(<SearchResultItem record={record} matches={{}} onSelect={() => {}} />);
    expect(html).not.toContain('<b class="search-hl">');
  });
});
