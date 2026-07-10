import { test, expect } from '../../playwright';

const TABS = ['overview', 'headers', 'variables', 'auth', 'scripts', 'tests'];

test.describe('collection settings', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test.beforeEach(async ({ page, collectionSettings }) => {
    await page.goto('/#/?pg=1&dock=bottom');
    await collectionSettings.open();
  });

  test('renders the six tabs', async ({ collectionSettings }) => {
    for (const id of TABS) {
      await expect(collectionSettings.tab(id)).toBeVisible();
    }
  });

  test('overview renders the docs markdown or an empty state', async ({ collectionSettings }) => {
    await expect(collectionSettings.overviewMarkdown.or(collectionSettings.overviewEmpty)).toBeVisible();
  });

  test('headers toggles between key/value and bulk edit', async ({ collectionSettings }) => {
    await collectionSettings.openTab('headers');
    await expect(collectionSettings.bulkEditToggle).toHaveText('Bulk edit');
    await collectionSettings.bulkEditToggle.click();
    await expect(collectionSettings.bulkEditToggle).toHaveText('Key/Value edit');
    await collectionSettings.bulkEditToggle.click();
    await expect(collectionSettings.bulkEditToggle).toHaveText('Bulk edit');
  });

  test('vars shows the collection variables table', async ({ collectionSettings }) => {
    await collectionSettings.openTab('variables');
    await expect(collectionSettings.varsTable).toBeVisible();
  });

  test('auth edits basic credentials and switches to OAuth 2.0', async ({ collectionSettings }) => {
    await collectionSettings.openTab('auth');
    await collectionSettings.authMode.selectOption('basic');
    await expect(collectionSettings.authField('username')).toBeVisible();
    await expect(collectionSettings.authField('password')).toBeVisible();

    await collectionSettings.authMode.selectOption('oauth2');
    await expect(collectionSettings.grantType).toBeVisible();
  });

  test('scripts shows pre-request and post-response editors', async ({ collectionSettings }) => {
    await collectionSettings.openTab('scripts');
    await expect(collectionSettings.tab('pre-request')).toBeVisible();
    await expect(collectionSettings.tab('post-response')).toBeVisible();
  });

  test('persists an edited auth value across tab switches', async ({ collectionSettings }) => {
    await collectionSettings.openTab('auth');
    await collectionSettings.authMode.selectOption('basic');
    await collectionSettings.authField('username').fill('admin');

    await collectionSettings.openTab('variables');
    await collectionSettings.openTab('auth');

    await expect(collectionSettings.authField('username')).toHaveValue('admin');
  });
});
