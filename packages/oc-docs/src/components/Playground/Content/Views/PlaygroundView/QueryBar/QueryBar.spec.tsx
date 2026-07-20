import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, vi } from 'vitest';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { MenuDropdownItem } from '../../../../../../ui/MenuDropdown';

// Capture the items QueryBar hands to the method dropdown. The real MenuDropdown
// (Tippy) only renders its rows while open, so the options never reach the DOM
// in an SSR render — intercepting the prop is the only way to observe them.
const capturedItems: MenuDropdownItem[][] = [];

vi.mock('../../../../../../ui/MenuDropdown', () => ({
  default: ({ items }: { items: MenuDropdownItem[] }) => {
    capturedItems.push(items);
    return null;
  }
}));

import QueryBar from './QueryBar';

const httpItem: HttpRequest = {
  name: 'Example',
  type: 'http',
  http: { method: 'GET', url: 'https://example.com' }
};

const offeredMethods = (): string[] => {
  capturedItems.length = 0;
  renderToStaticMarkup(
    <QueryBar item={httpItem} onSendRequest={() => {}} isLoading={false} onItemChange={() => {}} />
  );
  return capturedItems[0].map((item) => String(item.id));
};

describe('QueryBar method select', () => {
  it('offers exactly the seven HTTP methods, in order', () => {
    expect(offeredMethods()).toEqual(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']);
  });

  // The query bar drives an HTTP client, so non-HTTP protocols must never be
  // selectable even though they share the method-colour map.
  it.each(['GRAPHQL', 'GQL', 'GRPC', 'WEBSOCKET', 'WS'])('does not offer the non-HTTP protocol %s', (protocol) => {
    expect(offeredMethods()).not.toContain(protocol);
  });
});
