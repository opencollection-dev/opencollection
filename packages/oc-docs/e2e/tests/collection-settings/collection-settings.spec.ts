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

  test('bearer, api key, and digest render their fields', async ({ collectionSettings }) => {
    await collectionSettings.openTab('auth');

    await collectionSettings.selectAuthMode('bearer');
    await expect(collectionSettings.authField('token')).toHaveAttribute('type', 'password');

    await collectionSettings.selectAuthMode('apikey');
    await expect(collectionSettings.authField('key')).toBeVisible();
    await expect(collectionSettings.authField('value')).toHaveAttribute('type', 'text');
    await expect(collectionSettings.authField('placement')).toBeVisible();

    await collectionSettings.selectAuthMode('digest');
    await expect(collectionSettings.authField('username')).toBeVisible();
    await expect(collectionSettings.authField('password')).toHaveAttribute('type', 'password');
  });

  test('aws signature v4 shows all six fields and reveals only the secret access key', async ({
    collectionSettings
  }) => {
    await collectionSettings.openTab('auth');
    await collectionSettings.selectAuthMode('awsv4');

    for (const field of ['accessKeyId', 'secretAccessKey', 'sessionToken', 'service', 'region', 'profileName']) {
      await expect(collectionSettings.authField(field)).toBeVisible();
    }

    const secret = collectionSettings.authField('secretAccessKey');
    await expect(secret).toHaveAttribute('type', 'password');
    await collectionSettings.authField('secretAccessKey-toggle').click();
    await expect(secret).toHaveAttribute('type', 'text');

    await expect(collectionSettings.authField('accessKeyId')).toHaveAttribute('type', 'text');
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
