import { test, expect } from '../../playwright';

const DESKTOP = { width: 1280, height: 900 };

test.describe('Playground request — inherited auth', () => {
  test.use({ viewport: DESKTOP });

  test('the auth dropdown offers Inherit alongside the four supported types, and nothing more', async ({
    playground
  }) => {
    await playground.open('bottom');
    await playground.openRequest('get users');
    await playground.selectTab('auth');

    await playground.auth.open();
    await expect(playground.auth.option('none')).toBeVisible();
    await expect(playground.auth.option('inherit')).toBeVisible();
    await expect(playground.auth.option('basic')).toBeVisible();
    await expect(playground.auth.option('bearer')).toBeVisible();
    await expect(playground.auth.option('apikey')).toBeVisible();
    // No Auth + Inherit + Basic + Bearer + API Key — no other auth types are offered.
    await expect(playground.auth.options).toHaveCount(5);
  });

  test('choosing Inherit shows the inherited-auth notice and marks the mode selected', async ({
    playground
  }) => {
    await playground.open('bottom');
    await playground.openRequest('get users');
    await playground.selectTab('auth');

    await playground.auth.selectMode('inherit');
    await expect(playground.auth.modeSelect).toContainText('Inherit');
    await expect(playground.auth.inheritNotice).toBeVisible();
  });

  test('a request already set to inherit opens with Inherit preselected', async ({ playground }) => {
    await playground.open('bottom');
    // Get All Customers inherits its auth from the Bearer-authed collection.
    await playground.openTreeItem(['billing', 'customers', 'Get All Customers']);
    await playground.selectTab('auth');

    await expect(playground.auth.modeSelect).toContainText('Inherit');
    await expect(playground.auth.inheritNotice).toBeVisible();
  });
});
