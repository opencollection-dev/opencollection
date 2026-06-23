import { test, expect } from '../../playwright';

/**
 * The Markdown rendered inside the Overview's "Overview" (documentation) section.
 */
test.describe('Overview documentation (rendered Markdown)', () => {
  test.beforeEach(async ({ overviewPage }) => {
    await overviewPage.goto();
  });

  test('renders the "Getting Started", "Authentication" and "Rate Limits" section headings', async ({ overviewPage }) => {
    const { markdown } = overviewPage;
    await expect(markdown.heading('Getting Started')).toBeVisible();
    await expect(markdown.heading('Authentication')).toBeVisible();
    await expect(markdown.heading('Rate Limits')).toBeVisible();
  });

  test('renders the intro paragraph and shows the product name "OpenCollection" in bold', async ({ overviewPage }) => {
    const { markdown } = overviewPage;
    await expect(markdown.paragraph('comprehensive API collection for testing')).toBeVisible();
    await expect(markdown.boldText('OpenCollection')).toBeVisible();
  });

  test('renders the getting-started steps as an ordered list', async ({ overviewPage }) => {
    const { markdown } = overviewPage;
    await expect(markdown.numberedItem('Select an environment')).toBeVisible();
    await expect(markdown.numberedItem('Try out the various API endpoints')).toBeVisible();
    await expect(markdown.numberedItem('Check the response examples')).toBeVisible();
  });

  test('renders the environments table with its column headers and Local/Prod rows', async ({ overviewPage }) => {
    const { markdown } = overviewPage;
    await expect(markdown.table()).toBeVisible();
    await expect(markdown.columnHeader('Environment')).toBeVisible();
    await expect(markdown.columnHeader('Base URL')).toBeVisible();
    await expect(markdown.columnHeader('Auth')).toBeVisible();
    await expect(markdown.cell('Local')).toBeVisible();
    await expect(markdown.cell('Prod')).toBeVisible();
  });

  test('renders the example request as a fenced code block', async ({ overviewPage }) => {
    await expect(overviewPage.markdown.code('curl -H')).toBeVisible();
  });
});
