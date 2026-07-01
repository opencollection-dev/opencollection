import { test, expect } from '../../playwright';

test.describe('Folder page', () => {
  test('displays the folder name and how many requests it contains', async ({ folderPage }) => {
    await folderPage.open(['Realtime']);
    await expect(folderPage.title).toHaveText('Realtime');
    await expect(folderPage.requestCount).toHaveText('3 requests');
  });

  test('shows the "No folder configuration" empty state when the folder has no config', async ({ folderPage }) => {
    await folderPage.open(['Realtime']);
    await expect(folderPage.emptyState).toBeVisible();
    await expect(folderPage.emptyState).toContainText('No folder configuration');
    await expect(folderPage.configuration.root).toBeHidden();
  });

  test('renders the configuration with inherited auth and folder-level scripts', async ({ folderPage }) => {
    await folderPage.open(['billing']);

    await test.step('the configuration is shown instead of the empty state', async () => {
      await expect(folderPage.configuration.root).toBeVisible();
      await expect(folderPage.emptyState).toBeHidden();
    });

    await test.step('the auth group shows the inherited-from-collection badge', async () => {
      await expect(folderPage.configuration.auth).toBeVisible();
      await expect(folderPage.configuration.auth).toContainText('Inherited from collection');
    });

    await test.step('the script group is shown', async () => {
      await expect(folderPage.configuration.script).toBeVisible();
    });
  });

  test('shows the Tests group when the folder defines folder-scoped tests', async ({ folderPage }) => {
    await folderPage.open(['billing', 'customers']);
    await expect(folderPage.title).toHaveText('customers');
    await expect(folderPage.configuration.tests).toBeVisible();
  });

  test('renders the folder docs as markdown and collapses long content behind a "View more" toggle', async ({
    folderPage
  }) => {
    await folderPage.open(['billing']);

    await test.step('the markdown is rendered with formatting', async () => {
      await expect(folderPage.folderMarkdownDocs).toBeVisible();
      await expect(folderPage.folderMarkdownDocs).toContainText('Endpoints for managing');
      await expect(folderPage.folderMarkdownDocs.locator('strong').first()).toHaveText('customers');
    });

    await test.step('long docs collapse to a preview with a "View more" toggle', async () => {
      await expect(folderPage.folderMarkdownDocsToggle).toHaveText('View more');
      await folderPage.folderMarkdownDocsToggle.click();
      await expect(folderPage.folderMarkdownDocsToggle).toHaveText('View less');
    });
  });
});
