import { test, expect, buildOverviewLocators, gotoOverview } from '../utils';

/**
 * Markdown rendering inside the Overview's documentation section. The sample
 * collection's `docs` exercises headings, inline formatting, lists, a table,
 * a code block and a blockquote.
 */
test.describe('Overview documentation (markdown)', () => {
  test.beforeEach(async ({ page }) => {
    await gotoOverview(page);
  });

  test('renders markdown headings', async ({ page }) => {
    const { docs } = buildOverviewLocators(page);
    await expect(docs.heading('Getting Started')).toBeVisible();
    await expect(docs.heading('Authentication')).toBeVisible();
    await expect(docs.heading('Rate Limits')).toBeVisible();
  });

  test('renders paragraphs with inline formatting', async ({ page }) => {
    const { docs } = buildOverviewLocators(page);
    await expect(docs.content().getByText('comprehensive API collection for testing')).toBeVisible();
    await expect(docs.content().locator('strong', { hasText: 'OpenCollection' })).toBeVisible();
  });

  test('renders an ordered list', async ({ page }) => {
    const { docs } = buildOverviewLocators(page);
    await expect(docs.content().getByText('Select an environment')).toBeVisible();
    await expect(docs.content().getByText('Try out the various API endpoints')).toBeVisible();
    await expect(docs.content().getByText('Check the response examples')).toBeVisible();
  });

  test('renders a markdown table', async ({ page }) => {
    const { docs } = buildOverviewLocators(page);
    const table = docs.table();
    await expect(table).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Environment' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Base URL' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Auth' })).toBeVisible();
    await expect(table.getByRole('cell', { name: 'Local', exact: true })).toBeVisible();
    await expect(table.getByRole('cell', { name: 'Prod', exact: true })).toBeVisible();
  });

  test('renders a code block', async ({ page }) => {
    const { docs } = buildOverviewLocators(page);
    await expect(docs.content().locator('code', { hasText: 'curl -H' })).toBeVisible();
  });

  test('renders a blockquote', async ({ page }) => {
    const { docs } = buildOverviewLocators(page);
    const blockquote = docs.content().locator('blockquote');
    await expect(blockquote).toBeVisible();
    await expect(blockquote.getByText('Note')).toBeVisible();
    await expect(blockquote.locator('code', { hasText: 'X-RateLimit-Remaining' })).toBeVisible();
  });
});
