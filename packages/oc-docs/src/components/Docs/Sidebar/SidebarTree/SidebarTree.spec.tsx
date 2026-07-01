import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import type { Item as OpenCollectionItem } from '@opencollection/types/collection/item';
import SidebarTree from './SidebarTree';

const req = (uuid: string, name: string, method: string): OpenCollectionItem =>
  ({ type: 'http', uuid, name, method } as unknown as OpenCollectionItem);
const folder = (
  uuid: string,
  name: string,
  items: OpenCollectionItem[],
  isCollapsed = false
): OpenCollectionItem =>
  ({ type: 'folder', uuid, name, items, isCollapsed } as unknown as OpenCollectionItem);

const uuidToSlug = new Map<string, string>([
  ['f-auth', 'authentication'],
  ['r-login', 'authentication/login'],
]);

const noop = () => {};
const render = (props: Partial<React.ComponentProps<typeof SidebarTree>> = {}) =>
  renderToStaticMarkup(
    <SidebarTree
      items={[folder('f-auth', 'Authentication', [req('r-login', 'Login', 'POST')])]}
      activeSlug=""
      uuidToSlug={uuidToSlug}
      onNavigate={noop}
      onToggleFolder={noop}
      {...props}
    />
  );

describe('SidebarTree', () => {
  it('renders a folder and, when expanded, its request with a method label', () => {
    const html = render();
    expect(html).toContain('Authentication');
    expect(html).toContain('Login');
    expect(html).toContain('POST');
  });

  it('hides children of a collapsed folder', () => {
    const html = render({
      items: [folder('f-auth', 'Authentication', [req('r-login', 'Login', 'POST')], true)],
    });
    expect(html).toContain('Authentication');
    expect(html).not.toContain('Login');
  });

  it('marks the active item', () => {
    expect(render({ activeSlug: 'authentication/login' })).toContain('active');
  });

  it('labels non-HTTP protocols (websocket, grpc, graphql)', () => {
    const items = [
      { type: 'websocket', uuid: 'w1', name: 'Live Feed' },
      { type: 'grpc', uuid: 'g1', name: 'Stream' },
      { type: 'graphql', uuid: 'q1', name: 'Query' },
    ] as unknown as OpenCollectionItem[];
    const html = renderToStaticMarkup(
      <SidebarTree
        items={items}
        activeSlug=""
        uuidToSlug={new Map()}
        onNavigate={noop}
        onToggleFolder={noop}
      />
    );
    expect(html).toContain('WS');
    expect(html).toContain('GRPC');
    expect(html).toContain('GQL');
  });

  it('renders script files as monospace with a .js suffix and no method label', () => {
    const script = { type: 'script', uuid: 's1', name: 'setup' } as unknown as OpenCollectionItem;
    const html = renderToStaticMarkup(
      <SidebarTree
        items={[script]}
        activeSlug=""
        uuidToSlug={new Map([['s1', 'setup']])}
        onNavigate={noop}
        onToggleFolder={noop}
      />
    );
    expect(html).toContain('setup.js');
    expect(html).toContain('navlink-label mono');
  });
});
