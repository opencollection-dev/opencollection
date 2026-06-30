import { test, expect } from '../../playwright';

const UNSUPPORTED_REQUESTS = [
  { paths: ['Realtime', 'Live Updates'], name: 'Live Updates', typeLabel: 'Websocket' },
  { paths: ['Realtime', 'GraphQL API'], name: 'GraphQL API', typeLabel: 'GraphQL' },
  { paths: ['Realtime', 'Order Service'], name: 'Order Service', typeLabel: 'gRPC' }
];

test.describe('Request page — unsupported request types', () => {
  for (const { paths, name, typeLabel } of UNSUPPORTED_REQUESTS) {
    test(`shows a "preview not available" notice for a ${typeLabel} request`, async ({ unsupportedRequestPage }) => {
      await unsupportedRequestPage.open(paths);

      await expect(unsupportedRequestPage.title).toHaveText(typeLabel);
      await expect(unsupportedRequestPage.breadcrumb.segment('Realtime')).toBeVisible();
      await expect(unsupportedRequestPage.breadcrumb.current).toHaveText(name);
      await expect(unsupportedRequestPage.message).toContainText('Preview not available');
      await expect(unsupportedRequestPage.message).toContainText(`${typeLabel} documentation`);
    });
  }
});
