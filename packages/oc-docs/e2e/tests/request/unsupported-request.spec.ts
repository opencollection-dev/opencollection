import { test, expect } from '../../playwright';

const UNSUPPORTED_REQUESTS = [
  { paths: ['Realtime', 'Live Updates'], name: 'Live Updates', typeLabel: 'Websocket', shortName: 'WS', url: '/ws/updates' },
  { paths: ['Realtime', 'GraphQL API'], name: 'GraphQL API', typeLabel: 'GraphQL', shortName: 'GQL', url: '/graphql' },
  { paths: ['Realtime', 'Order Service'], name: 'Order Service', typeLabel: 'gRPC', shortName: 'GRPC', url: '/orders.OrderService' }
];

test.describe('Request page — unsupported request types', () => {
  for (const { paths, name, typeLabel, shortName, url } of UNSUPPORTED_REQUESTS) {
    test(`shows a "preview not available" notice for a ${typeLabel} request`, async ({ unsupportedRequestPage }) => {
      await unsupportedRequestPage.open(paths);

      await expect(unsupportedRequestPage.title).toHaveText(name);
      await expect(unsupportedRequestPage.breadcrumb.segment('Realtime')).toBeVisible();
      await expect(unsupportedRequestPage.breadcrumb.current).toHaveText(name);
      await expect(unsupportedRequestPage.message).toContainText('Preview not available');
      await expect(unsupportedRequestPage.message).toContainText(`${typeLabel} documentation`);
    });

    test(`renders the protocol method and url for a ${typeLabel} request`, async ({ unsupportedRequestPage }) => {
      await unsupportedRequestPage.open(paths);

      await expect(unsupportedRequestPage.urlBar.root).toBeVisible();
      await expect(unsupportedRequestPage.urlBar.method).toHaveText(shortName);
      await expect(unsupportedRequestPage.urlBar.url).toContainText(url);
    });
  }

  test('renders request docs on the docs page when the request provides them', async ({ unsupportedRequestPage }) => {
    // Only "Live Updates" carries a `docs` field in the sample collection.
    await unsupportedRequestPage.open(['Realtime', 'Live Updates']);

    await expect(unsupportedRequestPage.docs).toBeVisible();
    await expect(unsupportedRequestPage.docs).toContainText('full-duplex communication channel');
  });
});
