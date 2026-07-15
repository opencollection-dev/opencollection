import { test, expect } from '../../playwright';

const DESKTOP = { width: 1280, height: 900 };
const openAt = (dock: string): string => `/#/?pg=1&dock=${dock}`;

const UNSUPPORTED = [
  { paths: ['Realtime', 'Live Updates'], typeLabel: 'Websocket' },
  { paths: ['Realtime', 'GraphQL API'], typeLabel: 'GraphQL' },
  { paths: ['Realtime', 'Order Service'], typeLabel: 'gRPC' }
];

test.describe('Playground — unsupported request types', () => {
  test.use({ viewport: DESKTOP });

  for (const { paths, typeLabel } of UNSUPPORTED) {
    test(`shows a "not supported" notice when a ${typeLabel} request is opened`, async ({ page, playground }) => {
      await page.goto(openAt('bottom'));
      await playground.openTreeItem(paths);

      await expect(playground.unsupported).toBeVisible();
      await expect(playground.unsupportedIcon).toBeVisible();
      await expect(playground.unsupportedTitle).toHaveText(typeLabel);
      await expect(playground.unsupportedMessage).toContainText('Request type not supported');
      await expect(playground.unsupportedMessage).toContainText(`${typeLabel} isn't currently supported in this playground`);
    });
  }

  test('does not render request docs inside the playground (showRequestDocs is off)', async ({ page, playground }) => {
    await page.goto(openAt('bottom'));
    await playground.openTreeItem(['Realtime', 'Live Updates']);

    await expect(playground.unsupported).toBeVisible();
    await expect(playground.view.getByTestId('request-description')).toHaveCount(0);
  });
});
