import { test, expect } from '../../utils';
import { OverviewPage } from '../../pages/OverviewPage';

/**
 * Markdown rendering inside the Overview's documentation section. The sample
 * collection's `docs` exercises headings, inline formatting, lists, a table,
 * a code block and a blockquote.
 */
test.describe('Overview documentation (markdown)', () => {
  let overview: OverviewPage;

  test.beforeEach(async ({ page }) => {
    overview = new OverviewPage(page);
    await overview.goto();
  });

  test('renders markdown headings', async () => {
    const { docs } = overview.locators;
    await expect(docs.heading('Getting Started')).toBeVisible();
    await expect(docs.heading('Authentication')).toBeVisible();
    await expect(docs.heading('Rate Limits')).toBeVisible();
  });

  test('renders paragraphs with inline formatting', async () => {
    const { docs } = overview.locators;
    await expect(docs.content().getByText('comprehensive API collection for testing')).toBeVisible();
    await expect(docs.content().locator('strong', { hasText: 'OpenCollection' })).toBeVisible();
  });

  test('renders an ordered list', async () => {
    const { docs } = overview.locators;
    await expect(docs.content().getByText('Select an environment')).toBeVisible();
    await expect(docs.content().getByText('Try out the various API endpoints')).toBeVisible();
    await expect(docs.content().getByText('Check the response examples')).toBeVisible();
  });

  test('renders a markdown table', async () => {
    const { docs } = overview.locators;
    const table = docs.table();
    await expect(table).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Environment' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Base URL' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Auth' })).toBeVisible();
    await expect(table.getByRole('cell', { name: 'Local', exact: true })).toBeVisible();
    await expect(table.getByRole('cell', { name: 'Prod', exact: true })).toBeVisible();
  });

  test('renders a code block', async () => {
    const { docs } = overview.locators;
    await expect(docs.content().locator('code', { hasText: 'curl -H' })).toBeVisible();
  });

  test('renders a blockquote', async () => {
    const { docs } = overview.locators;
    const blockquote = docs.content().locator('blockquote');
    await expect(blockquote).toBeVisible();
    await expect(blockquote.getByText('Note')).toBeVisible();
    await expect(blockquote.locator('code', { hasText: 'X-RateLimit-Remaining' })).toBeVisible();
  });
});
