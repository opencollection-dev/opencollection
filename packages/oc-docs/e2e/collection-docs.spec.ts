import { test, expect } from '@playwright/test';

// TODO(BRU-3188): obsoleted by page-based nav — collection docs now render in the
// overview page body, currently a placeholder. Unskip when BRU-3571 lands the overview.

test.describe.skip('Collection-level documentation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.collection-docs');
  });

  test('renders at the top of the docs page', async ({ page }) => {
    const collectionDocs = page.locator('.collection-docs');
    await expect(collectionDocs).toBeVisible();

    // Should appear before any endpoint sections
    const firstEndpoint = page.locator('.endpoint-section').first();
    const docsBox = await collectionDocs.boundingBox();
    const endpointBox = await firstEndpoint.boundingBox();
    expect(docsBox!.y).toBeLessThan(endpointBox!.y);
  });

  test('renders markdown headings', async ({ page }) => {
    const docs = page.locator('.collection-docs');
    await expect(docs.getByRole('heading', { name: 'Getting Started', level: 2 })).toBeVisible();
    await expect(docs.getByRole('heading', { name: 'Authentication', level: 2 })).toBeVisible();
    await expect(docs.getByRole('heading', { name: 'Rate Limits', level: 2 })).toBeVisible();
  });

  test('renders collection name as page header above docs', async ({ page }) => {
    const heading = page
      .locator('.playground-content')
      .getByRole('heading', { name: 'Bruno Testbench', level: 1 });
    await expect(heading).toBeVisible();

    const headingBox = await heading.boundingBox();
    const docsBox = await page.locator('.collection-docs').boundingBox();
    expect(headingBox!.y).toBeLessThan(docsBox!.y);
  });

  test('renders markdown paragraphs with inline formatting', async ({ page }) => {
    const docs = page.locator('.collection-docs');
    await expect(docs.getByText('comprehensive API collection for testing')).toBeVisible();
    // Bold text
    await expect(docs.locator('strong', { hasText: 'OpenCollection' })).toBeVisible();
  });

  test('renders ordered list', async ({ page }) => {
    const docs = page.locator('.collection-docs');
    await expect(docs.getByText('Select an environment')).toBeVisible();
    await expect(docs.getByText('Try out the various API endpoints')).toBeVisible();
    await expect(docs.getByText('Check the response examples')).toBeVisible();
  });

  test('renders markdown table', async ({ page }) => {
    const docs = page.locator('.collection-docs');
    const table = docs.locator('table');
    await expect(table).toBeVisible();
    // Table headers
    await expect(table.getByRole('columnheader', { name: 'Environment' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Base URL' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Auth' })).toBeVisible();
    // Table data
    await expect(table.getByRole('cell', { name: 'Local', exact: true })).toBeVisible();
    await expect(table.getByRole('cell', { name: 'Prod', exact: true })).toBeVisible();
  });

  test('renders code blocks', async ({ page }) => {
    const docs = page.locator('.collection-docs');
    await expect(docs.locator('code', { hasText: 'curl -H' })).toBeVisible();
  });

  test('renders blockquote', async ({ page }) => {
    const docs = page.locator('.collection-docs');
    const blockquote = docs.locator('blockquote');
    await expect(blockquote).toBeVisible();
    await expect(blockquote.getByText('Note')).toBeVisible();
    await expect(blockquote.locator('code', { hasText: 'X-RateLimit-Remaining' })).toBeVisible();
  });
});
