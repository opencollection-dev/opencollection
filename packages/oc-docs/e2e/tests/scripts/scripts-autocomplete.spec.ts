import { test, expect } from '../../playwright';

test.describe('Scripts editor autocomplete', () => {
  test.beforeEach(async ({ page, playground }) => {
    await page.goto('/#/?pg=1&dock=bottom');
    await playground.openSidebarItem('get users');
    await expect(page).toHaveURL(/pgReq=/);
    await playground.selectTab('scripts');
  });

  test('offers req/bru completions in the pre-request script editor', async ({ page, playground }) => {
    const editor = playground.preRequestScriptEditor;
    await editor.focus();
    await page.keyboard.type('bru.getEnvVar');

    await expect(editor.suggestions).toBeVisible();
    await expect(editor.suggestions).toContainText('getEnvVar(key)');
  });

  test('offers res completions in the post-response script editor', async ({ page, playground }) => {
    await playground.selectScriptTab('post-response');

    const editor = playground.postResponseScriptEditor;
    await editor.focus();
    await page.keyboard.type('res.getBody');

    await expect(editor.suggestions).toBeVisible();
    await expect(editor.suggestions).toContainText('getBody()');
  });
});
