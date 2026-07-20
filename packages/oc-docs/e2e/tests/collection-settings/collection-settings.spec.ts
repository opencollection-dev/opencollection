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

  test('auth edits basic credentials', async ({ collectionSettings }) => {
    await collectionSettings.openTab('auth');
    await collectionSettings.selectAuthMode('basic');
    await expect(collectionSettings.authField('username')).toBeVisible();
    await expect(collectionSettings.authField('password')).toBeVisible();
    await expect(collectionSettings.authField('password')).toHaveAttribute('type', 'password');
  });

  test('bearer and api key render their fields', async ({ collectionSettings }) => {
    await collectionSettings.openTab('auth');

    await collectionSettings.selectAuthMode('bearer');
    await expect(collectionSettings.authField('token')).toHaveAttribute('type', 'password');

    await collectionSettings.selectAuthMode('apikey');
    await expect(collectionSettings.authField('key')).toBeVisible();
    await expect(collectionSettings.authField('value')).toHaveAttribute('type', 'text');
    await expect(collectionSettings.authField('placement')).toBeVisible();
  });

  test('does not offer Digest or AWS Signature v4 as selectable auth modes', async ({ collectionSettings }) => {
    await collectionSettings.openTab('auth');
    await collectionSettings.authMode.click();

    await expect(collectionSettings.authModeOption('basic')).toBeVisible();
    await expect(collectionSettings.authModeOption('digest')).toHaveCount(0);
    await expect(collectionSettings.authModeOption('awsv4')).toHaveCount(0);
  });

  test('scripts shows pre-request and post-response editors', async ({ collectionSettings }) => {
    await collectionSettings.openTab('scripts');
    await expect(collectionSettings.scriptTab('pre-request')).toBeVisible();
    await expect(collectionSettings.scriptTab('post-response')).toBeVisible();
  });

  test('persists an edited auth value across tab switches', async ({ collectionSettings }) => {
    await collectionSettings.openTab('auth');
    await collectionSettings.selectAuthMode('basic');
    await collectionSettings.authField('username').fill('admin');

    await collectionSettings.openTab('variables');
    await collectionSettings.openTab('auth');

    await expect(collectionSettings.authField('username')).toHaveValue('admin');
  });
});
