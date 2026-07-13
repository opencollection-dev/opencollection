import { test, expect } from '../../playwright';

test.describe('Scripts editor autocomplete', () => {
  test('offers Bruno API completions in the pre-request script editor', async ({ page, playground }) => {
    await page.goto('/#/?pg=1&dock=bottom');
    await playground.treeItems.filter({ hasText: 'get users' }).first().click();
    await expect(page).toHaveURL(/pgReq=/);

    await page.getByTestId('tabs-tab-scripts').click();

    const editor = page.getByTestId('scripts-editor-pre-request');
    // Monaco is loaded lazily (from CDN) on first mount — allow extra time.
    await expect(editor.locator('.monaco-editor')).toBeVisible({ timeout: 20000 });

    await editor.locator('.view-lines').click();
    await page.keyboard.type('bru.getEnvVar');

    const suggest = page.locator('.suggest-widget.visible');
    await expect(suggest).toBeVisible();
    await expect(suggest).toContainText('getEnvVar(key)');
  });
});
