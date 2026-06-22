import { test, expect } from '@fixtures';

test.describe('Collection-level documentation', () => {
  test.beforeEach(async ({ collectionPage }) => {
    await collectionPage.goto();
  });

  test('renders at the top of the docs page', async ({ collectionPage }) => {
    await expect(collectionPage.docs.root).toBeVisible();

    // Should appear before any endpoint sections.
    const docsBox = await collectionPage.docs.root.boundingBox();
    const endpointBox = await collectionPage.endpoints.first().boundingBox();
    expect(docsBox!.y).toBeLessThan(endpointBox!.y);
  });

  test('renders markdown headings', async ({ collectionPage }) => {
    const { docs } = collectionPage;
    await expect(docs.heading('Getting Started')).toBeVisible();
    await expect(docs.heading('Authentication')).toBeVisible();
    await expect(docs.heading('Rate Limits')).toBeVisible();
  });

  test('renders collection name as page header above docs', async ({ collectionPage }) => {
    const heading = collectionPage.heading('Bruno Testbench');
    await expect(heading).toBeVisible();

    const headingBox = await heading.boundingBox();
    const docsBox = await collectionPage.docs.root.boundingBox();
    expect(headingBox!.y).toBeLessThan(docsBox!.y);
  });

  test('renders markdown paragraphs with inline formatting', async ({ collectionPage }) => {
    const { docs } = collectionPage;
    await expect(docs.text('comprehensive API collection for testing')).toBeVisible();
    await expect(docs.strong('OpenCollection')).toBeVisible();
  });

  test('renders ordered list', async ({ collectionPage }) => {
    const { docs } = collectionPage;
    await expect(docs.text('Select an environment')).toBeVisible();
    await expect(docs.text('Try out the various API endpoints')).toBeVisible();
    await expect(docs.text('Check the response examples')).toBeVisible();
  });

  test('renders markdown table', async ({ collectionPage }) => {
    const { table } = collectionPage.docs;
    await expect(table).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Environment' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Base URL' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Auth' })).toBeVisible();
    await expect(table.getByRole('cell', { name: 'Local', exact: true })).toBeVisible();
    await expect(table.getByRole('cell', { name: 'Prod', exact: true })).toBeVisible();
  });

  test('renders code blocks', async ({ collectionPage }) => {
    await expect(collectionPage.docs.code('curl -H')).toBeVisible();
  });

  test('renders blockquote', async ({ collectionPage }) => {
    const { blockquote } = collectionPage.docs;
    await expect(blockquote).toBeVisible();
    await expect(blockquote.getByText('Note')).toBeVisible();
    await expect(blockquote.locator('code', { hasText: 'X-RateLimit-Remaining' })).toBeVisible();
  });
});
