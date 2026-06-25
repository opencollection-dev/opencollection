import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import type { WebSocketRequest } from '@opencollection/types/requests/websocket';
import { UnsupportedRequest } from './UnsupportedRequest';

const websocketItem = { info: { name: 'WS', type: 'websocket' } } as unknown as WebSocketRequest;

describe('UnsupportedRequest', () => {
  it('shows the request type as the page heading', () => {
    const html = renderToStaticMarkup(<UnsupportedRequest item={websocketItem} />);
    expect(html).toContain('Websocket');
  });

  it('explains that the type cannot be previewed in this viewer', () => {
    const html = renderToStaticMarkup(<UnsupportedRequest item={websocketItem} />);
    expect(html).toContain('Preview not available');
    expect(html).toContain('Websocket documentation');
    expect(html).toContain('supported in this viewer');
  });
});
