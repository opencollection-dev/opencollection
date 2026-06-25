import { test, expect } from '../../playwright';

test.describe('Overview documentation (rendered Markdown)', () => {
  test.beforeEach(async ({ overviewPage }) => {
    await overviewPage.goto();
  });

  test('renders the "Getting Started", "Authentication" and "Rate Limits" section headings', async ({ overviewPage }) => {
    const { docMarkdown } = overviewPage;
    await expect(docMarkdown.heading('Getting Started')).toBeVisible();
    await expect(docMarkdown.heading('Authentication')).toBeVisible();
    await expect(docMarkdown.heading('Rate Limits')).toBeVisible();
  });

  test('renders the intro paragraph and shows the product name "OpenCollection" in bold', async ({ overviewPage }) => {
    const { docMarkdown } = overviewPage;
    await expect(docMarkdown.paragraph('comprehensive API collection for testing')).toBeVisible();
    await expect(docMarkdown.boldText('OpenCollection')).toBeVisible();
  });

  test('renders the getting-started steps as an ordered list', async ({ overviewPage }) => {
    const { docMarkdown } = overviewPage;
    await expect(docMarkdown.numberedItem('Select an environment')).toBeVisible();
    await expect(docMarkdown.numberedItem('Try out the various API endpoints')).toBeVisible();
    await expect(docMarkdown.numberedItem('Check the response examples')).toBeVisible();
  });

  test('renders the environments table with its column headers and Local/Prod rows', async ({ overviewPage }) => {
    const { docMarkdown } = overviewPage;
    await expect(docMarkdown.table()).toBeVisible();
    await expect(docMarkdown.columnHeader('Environment')).toBeVisible();
    await expect(docMarkdown.columnHeader('Base URL')).toBeVisible();
    await expect(docMarkdown.columnHeader('Auth')).toBeVisible();
    await expect(docMarkdown.cell('Local')).toBeVisible();
    await expect(docMarkdown.cell('Prod')).toBeVisible();
  });

  test('renders the example request as a fenced code block', async ({ overviewPage }) => {
    await expect(overviewPage.docMarkdown.code('curl -H')).toBeVisible();
  });
});
