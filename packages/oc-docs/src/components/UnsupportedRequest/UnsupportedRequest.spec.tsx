import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'node-html-parser';
import { describe, it, expect } from 'vitest';
import type { WebSocketRequest } from '@opencollection/types/requests/websocket';
import { UnsupportedRequest } from './UnsupportedRequest';
import { getByTestId, queryByTestId } from '../../test-utils/dom';

const websocketItem = {
  info: { name: 'WS', type: 'websocket' },
  docs: 'Streams **real-time** updates.'
} as unknown as WebSocketRequest;

const emptyStateProps = {
  icon: <span>icon</span>,
  heading: 'Preview not available',
  subheadingSuffix: "documentation isn't supported in this viewer."
};

describe('UnsupportedRequest', () => {
  it('shows the request type as the page heading', () => {
    const root = parse(
      renderToStaticMarkup(
        <UnsupportedRequest item={websocketItem} showRequestDocs emptyStateProps={emptyStateProps} />
      )
    );
    expect(getByTestId(root, 'unsupported-request-title').text).toContain('Websocket');
  });

  it('renders the heading title variant by default', () => {
    const root = parse(
      renderToStaticMarkup(
        <UnsupportedRequest item={websocketItem} showRequestDocs emptyStateProps={emptyStateProps} />
      )
    );
    const title = getByTestId(root, 'unsupported-request-title');
    expect(title.classNames).toContain('heading');
    expect(title.text).toContain('Websocket');
  });

  it('renders the label title variant with the shared testid', () => {
    const root = parse(
      renderToStaticMarkup(
        <UnsupportedRequest
          item={websocketItem}
          titleVariant="label"
          showRequestDocs={false}
          emptyStateProps={emptyStateProps}
        />
      )
    );
    const title = getByTestId(root, 'unsupported-request-title');
    expect(title.tagName).toBe('P');
    expect(title.classNames).not.toContain('heading');
    expect(title.text).toContain('Websocket');
  });

  it('explains that the type cannot be previewed in this viewer', () => {
    const root = parse(
      renderToStaticMarkup(
        <UnsupportedRequest item={websocketItem} showRequestDocs emptyStateProps={emptyStateProps} />
      )
    );
    const empty = getByTestId(root, 'unsupported-request-empty');
    expect(empty.text).toContain('Preview not available');
    expect(empty.text).toContain('Websocket documentation');
    expect(empty.text).toContain('supported in this viewer');
  });

  it('renders the request docs when showRequestDocs is set', () => {
    const root = parse(
      renderToStaticMarkup(
        <UnsupportedRequest item={websocketItem} showRequestDocs emptyStateProps={emptyStateProps} />
      )
    );
    expect(queryByTestId(root, 'overview-markdown-documentation')).toBeTruthy();
  });

  it('omits the request docs when showRequestDocs is off', () => {
    const root = parse(
      renderToStaticMarkup(
        <UnsupportedRequest item={websocketItem} showRequestDocs={false} emptyStateProps={emptyStateProps} />
      )
    );
    expect(queryByTestId(root, 'overview-markdown-documentation')).toBeNull();
  });
});
