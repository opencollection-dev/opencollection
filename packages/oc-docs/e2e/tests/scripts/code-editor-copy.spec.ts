import { test, expect } from '../../playwright';

test.describe('Monaco editor copy button', () => {
  test('reveals a copy button on hover and copies the editor content', async ({ page, playground, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto('/#/?pg=1&dock=bottom');
    await playground.treeItems.filter({ hasText: 'get users' }).first().click();
    await page.getByTestId('tabs-tab-scripts').click();

    const editor = page.getByTestId('scripts-editor-pre-request');
    await expect(editor.locator('.monaco-editor')).toBeVisible({ timeout: 20000 });

    await editor.locator('.view-lines').click();
    await page.keyboard.type('const answer = 42;');
    await page.keyboard.press('Escape');

    const copyBtn = editor.getByTestId('scripts-editor-pre-request-copy');

    await test.step('hidden until the editor is hovered', async () => {
      await page.mouse.move(0, 0); // move off the editor (clicking it left the pointer over it)
      await expect(copyBtn).toHaveCSS('opacity', '0');
    });

    await test.step('revealed on hover (top-right)', async () => {
      await editor.hover();
      await expect(copyBtn).toHaveCSS('opacity', '1');
    });

    await test.step('clicking it copies the editor content', async () => {
      await copyBtn.click();
      await expect
        .poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toContain('const answer = 42;');
    });
  });
});
