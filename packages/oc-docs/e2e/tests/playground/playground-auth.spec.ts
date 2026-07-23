import { test, expect } from '../../playwright';

const DESKTOP = { width: 1280, height: 900 };

test.describe('Playground request — inherited auth', () => {
  test.use({ viewport: DESKTOP });

  test('the auth dropdown offers Inherit alongside the four supported types, and nothing more', async ({
    playground,
    requestAuth
  }) => {
    await playground.open('bottom');
    await playground.openRequest('get users');
    await playground.selectTab('auth');

    await requestAuth.open();
    await expect(requestAuth.option('none')).toBeVisible();
    await expect(requestAuth.option('inherit')).toBeVisible();
    await expect(requestAuth.option('basic')).toBeVisible();
    await expect(requestAuth.option('bearer')).toBeVisible();
    await expect(requestAuth.option('apikey')).toBeVisible();
    // No Auth + Inherit + Basic + Bearer + API Key — no other auth types are offered.
    await expect(requestAuth.options).toHaveCount(5);
  });

  test('choosing Inherit shows the inherited-auth notice and marks the mode selected', async ({
    playground,
    requestAuth
  }) => {
    await playground.open('bottom');
    await playground.openRequest('get users');
    await playground.selectTab('auth');

    await requestAuth.selectMode('inherit');
    await expect(requestAuth.modeSelect).toContainText('Inherit');
    await expect(requestAuth.inheritNotice).toBeVisible();
  });

  test('a request already set to inherit opens with Inherit preselected', async ({ playground, requestAuth }) => {
    await playground.open('bottom');
    // Get All Customers inherits its auth from the Bearer-authed collection.
    await playground.openTreeItem(['billing', 'customers', 'Get All Customers']);
    await playground.selectTab('auth');

    await expect(requestAuth.modeSelect).toContainText('Inherit');
    await expect(requestAuth.inheritNotice).toBeVisible();
  });
});
