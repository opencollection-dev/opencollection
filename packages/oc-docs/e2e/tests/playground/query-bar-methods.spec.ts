import { test, expect } from '../../playwright';

const DESKTOP = { width: 1280, height: 900 };

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
const NON_HTTP_METHODS = ['GRAPHQL', 'GQL', 'GRPC', 'WEBSOCKET', 'WS'];

test.describe('Playground — query bar method dropdown', () => {
  test.use({ viewport: DESKTOP });

  test('offers only HTTP methods, not non-HTTP protocols', async ({ playground }) => {
    await playground.open('bottom');
    await playground.openTreeItem(['get users']);

    await expect(playground.methodSelect).toBeVisible();
    const options = (await playground.methodOptions()).map((o) => o.trim().toUpperCase());

    expect(options).toEqual(HTTP_METHODS);
    for (const protocol of NON_HTTP_METHODS) {
      expect(options).not.toContain(protocol);
    }
  });
});
