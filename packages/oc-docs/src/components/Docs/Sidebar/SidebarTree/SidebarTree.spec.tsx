import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, vi } from 'vitest';
import type { Item as OpenCollectionItem } from '@opencollection/types/collection/item';
import SidebarTree from './SidebarTree';
import { useRenderToDom } from '../../../../hooks/useRenderToDom';

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

  it('renders script files with a .js suffix and a JS badge (default font label)', () => {
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
    expect(html).not.toContain('navlink-label mono');
    expect(html).toContain('>JS<');
  });
});

describe('SidebarTree collectionRoot', () => {
  const items = [
    { type: 'http-request', name: 'get users', uuid: 'u1', method: 'GET' } as never,
  ];
  const base = {
    items,
    activeSlug: '',
    uuidToSlug: new Map([['u1', 'get-users']]),
    onNavigate: noop,
    onToggleFolder: noop,
  };

  it('renders no collection root when the prop is omitted (docs parity)', () => {
    const html = renderToStaticMarkup(<SidebarTree {...base} />);
    expect(html).not.toContain('sidebar-collection-root');
  });

  it('renders a collection root row and its children when expanded', () => {
    const onClick = vi.fn();
    const html = renderToStaticMarkup(
      <SidebarTree
        {...base}
        collectionRoot={{
          name: 'Bruno Testbench',
          collapsed: false,
          active: false,
          onToggle: noop,
          onClick,
          testId: 'sidebar-collection-root',
        }}
      />
    );
    expect(html).toContain('sidebar-collection-root');
    expect(html).toContain('Bruno Testbench');
    expect(html).toContain('get users');
  });

  it('hides children when the collection root is collapsed', () => {
    const html = renderToStaticMarkup(
      <SidebarTree
        {...base}
        collectionRoot={{
          name: 'Bruno Testbench',
          collapsed: true,
          active: false,
          onToggle: noop,
          onClick: noop,
          testId: 'sidebar-collection-root',
        }}
      />
    );
    expect(html).toContain('sidebar-collection-root');
    expect(html).toContain('Bruno Testbench');
    expect(html).not.toContain('get users');
  });
});

const requestWithExamples = {
  uuid: 'req-1',
  type: 'http',
  name: 'Login',
  method: 'POST',
  examples: [
    { name: 'Successful login', response: { status: 200 } },
    { name: 'Invalid credentials', response: { status: 401 } },
  ],
} as unknown as OpenCollectionItem;

const baseProps = {
  activeSlug: '',
  uuidToSlug: new Map<string, string>([['req-1', 'login']]),
  onNavigate: () => {},
  onToggleFolder: () => {},
};

const tree = (props: Partial<React.ComponentProps<typeof SidebarTree>> = {}) => (
  <SidebarTree items={[requestWithExamples]} {...baseProps} {...props} />
);

describe('SidebarTree examples', () => {
  it('shows an example toggle for a request with examples but keeps rows collapsed by default', () => {
    const root = useRenderToDom(tree());
    expect(root.querySelector('[data-testid="sidebar-example-toggle"]')).not.toBeNull();
    expect(root.querySelectorAll('[data-testid="sidebar-example"]')).toHaveLength(0);
  });

  it('auto-expands and marks the active example row when activeExample matches', () => {
    const root = useRenderToDom(tree({ activeExample: { requestUuid: 'req-1', index: 1 } }));
    const rows = root.querySelectorAll('[data-testid="sidebar-example"]');
    expect(rows).toHaveLength(2);
    expect(rows[0].text).toContain('Successful login');
    expect(rows[1].text).toContain('Invalid credentials');
    expect(rows[1].getAttribute('class') ?? '').toContain('active');
    expect(rows[0].getAttribute('class') ?? '').not.toContain('active');
  });

  it('renders a request without examples as a plain leaf (no toggle)', () => {
    const plain = { uuid: 'r2', type: 'http', name: 'Ping', method: 'GET' } as unknown as OpenCollectionItem;
    const root = useRenderToDom(
      <SidebarTree
        {...baseProps}
        items={[plain]}
        uuidToSlug={new Map([['r2', 'ping']])}
      />
    );
    expect(root.querySelector('[data-testid="sidebar-example-toggle"]')).toBeNull();
  });
});
