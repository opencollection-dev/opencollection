import { test, expect } from '../../playwright';

const BILLING_SCRIPT_PATH = ['billing', 'Script.js'];

test.describe('Script page', () => {
  test.beforeEach(async ({ scriptPage }) => {
    await scriptPage.open(BILLING_SCRIPT_PATH);
  });

  test('shows the script name as the page title', async ({ scriptPage }) => {
    await expect(scriptPage.title).toHaveText('Script');
  });

  test('shows the folder path to the script as a breadcrumb', async ({ scriptPage }) => {
    await expect(scriptPage.breadcrumb.segment('billing')).toBeVisible();
    await expect(scriptPage.breadcrumb.current).toHaveText('Script');
  });

  test('renders the script source as a read-only code block', async ({ scriptPage }) => {
    const { content } = scriptPage;
    await expect(content.root).toBeVisible();
    await expect(content.code).toContainText('user@example.com');
    await expect(content.code).toContainText('password123');
  });

  test('offers a button to copy the script', async ({ scriptPage }) => {
    await expect(scriptPage.content.copyButton).toBeVisible();
  });
});
