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

const unnamedItem = {
  info: { type: 'websocket' }
} as unknown as WebSocketRequest;

const emptyStateProps = {
  icon: <span>icon</span>,
  heading: 'Preview not available',
  subheadingSuffix: "documentation isn't supported in this viewer."
};

describe('UnsupportedRequest', () => {
  it('shows the request name as the page heading', () => {
    const root = parse(
      renderToStaticMarkup(
        <UnsupportedRequest item={websocketItem} showRequestDocs emptyStateProps={emptyStateProps} />
      )
    );
    expect(getByTestId(root, 'unsupported-request-title').text).toContain('WS');
  });

  it('renders the heading title variant by default', () => {
    const root = parse(
      renderToStaticMarkup(
        <UnsupportedRequest item={websocketItem} showRequestDocs emptyStateProps={emptyStateProps} />
      )
    );
    const title = getByTestId(root, 'unsupported-request-title');
    expect(title.classNames).toContain('heading');
    expect(title.text).toContain('WS');
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
    expect(title.classNames).toContain('title-label');
    expect(title.classNames).not.toContain('heading');
    expect(title.text).toContain('WS');
  });

  it('falls back to a provided customName when the item has no name', () => {
    const root = parse(
      renderToStaticMarkup(
        <UnsupportedRequest
          item={unnamedItem}
          customName="My request"
          showRequestDocs={false}
          emptyStateProps={emptyStateProps}
        />
      )
    );
    expect(getByTestId(root, 'unsupported-request-title').text).toContain('My request');
  });

  it('falls back to the default "Untitled request" in the label variant', () => {
    const root = parse(
      renderToStaticMarkup(
        <UnsupportedRequest
          item={unnamedItem}
          titleVariant="label"
          showRequestDocs={false}
          emptyStateProps={emptyStateProps}
        />
      )
    );
    expect(getByTestId(root, 'unsupported-request-title').text).toContain('Untitled request');
  });

  it('falls back to the default "Untitled request" when the item has no name and no customName', () => {
    const root = parse(
      renderToStaticMarkup(
        <UnsupportedRequest item={unnamedItem} showRequestDocs={false} emptyStateProps={emptyStateProps} />
      )
    );
    expect(getByTestId(root, 'unsupported-request-title').text).toContain('Untitled request');
  });

  it('renders the resolved name as the current breadcrumb when breadcrumbs are shown', () => {
    const root = parse(
      renderToStaticMarkup(
        <UnsupportedRequest
          item={websocketItem}
          breadcrumbs={{}}
          showRequestDocs={false}
          emptyStateProps={emptyStateProps}
        />
      )
    );
    expect(getByTestId(root, 'unsupported-request-breadcrumb-current').text).toContain('WS');
  });

  it('does not render the breadcrumb when no breadcrumbs are passed', () => {
    const root = parse(
      renderToStaticMarkup(
        <UnsupportedRequest item={websocketItem} showRequestDocs={false} emptyStateProps={emptyStateProps} />
      )
    );
    expect(queryByTestId(root, 'unsupported-request-breadcrumb')).toBeNull();
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
