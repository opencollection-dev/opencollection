import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { Heading } from './Heading';

describe('Heading', () => {
  it('renders its children as an h1 by default', () => {
    const html = renderToStaticMarkup(<Heading>Hotel Booking API</Heading>);
    expect(html).toContain('Hotel Booking API');
    expect(html).toContain('<h1');
  });

  it('renders the element supplied via the "as" prop', () => {
    const html = renderToStaticMarkup(<Heading as="h2">Section</Heading>);
    expect(html).toContain('<h2');
    expect(html).toContain('Section');
  });

  // Assert on the element's class attribute (the injected <style> tag contains both
  // variant selectors regardless of which one is applied to the element).
  it('defaults to the lg size variant', () => {
    const html = renderToStaticMarkup(<Heading>Title</Heading>);
    expect(html).toMatch(/class="[^"]*heading--lg[^"]*"/);
    expect(html).not.toMatch(/class="[^"]*heading--md[^"]*"/);
  });

  it('applies the md size variant when requested', () => {
    const html = renderToStaticMarkup(<Heading size="md">Login</Heading>);
    expect(html).toMatch(/class="[^"]*heading--md[^"]*"/);
    expect(html).not.toMatch(/class="[^"]*heading--lg[^"]*"/);
  });
});
