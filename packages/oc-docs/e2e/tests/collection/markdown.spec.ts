import { test, expect } from '../../playwright';

/**
 * The collection opens with an overview written in Markdown. Read top to
 * bottom, these tests describe exactly what that overview shows on the page.
 */
test.describe('Collection overview (rendered Markdown)', () => {
  test.beforeEach(async ({ collectionPage }) => {
    await collectionPage.goto();
  });

  test('opens with an intro paragraph and the product name in bold', async ({ collectionPage }) => {
    const { overview } = collectionPage;
    await expect(overview.paragraph('This is a comprehensive API collection')).toBeVisible();
    await expect(overview.boldText('OpenCollection')).toBeVisible();
  });

  test('is organised under "Getting Started", "Authentication" and "Rate Limits" headings', async ({ collectionPage }) => {
    const { overview } = collectionPage;
    await expect(overview.heading('Getting Started')).toBeVisible();
    await expect(overview.heading('Authentication')).toBeVisible();
    await expect(overview.heading('Rate Limits')).toBeVisible();
  });

  test('lists the getting-started steps as a numbered list', async ({ collectionPage }) => {
    const { overview } = collectionPage;
    await expect(overview.numberedItem('Select an environment')).toBeVisible();
    await expect(overview.numberedItem('Try out the various API endpoints')).toBeVisible();
    await expect(overview.numberedItem('Check the response examples')).toBeVisible();
  });

  test('lists the rate-limit tiers as bullets with the tier names in bold', async ({ collectionPage }) => {
    const { overview } = collectionPage;
    await expect(overview.bulletedItem('100 requests/minute')).toBeVisible();
    await expect(overview.bulletedItem('1000 requests/minute')).toBeVisible();
    await expect(overview.boldText('Free tier')).toBeVisible();
    await expect(overview.boldText('Pro tier')).toBeVisible();
  });

  test('shows the environments in a table with Environment, Base URL and Auth columns', async ({ collectionPage }) => {
    const { overview } = collectionPage;
    await expect(overview.table()).toBeVisible();
    await expect(overview.columnHeader('Environment')).toBeVisible();
    await expect(overview.columnHeader('Base URL')).toBeVisible();
    await expect(overview.columnHeader('Auth')).toBeVisible();
    await expect(overview.cell('Local')).toBeVisible();
    await expect(overview.cell('Prod')).toBeVisible();
  });

  test('shows the example request as a code block', async ({ collectionPage }) => {
    await expect(collectionPage.overview.code('curl -H')).toBeVisible();
  });
});
