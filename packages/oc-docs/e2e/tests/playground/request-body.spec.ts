import { test, expect } from '../../playwright';

const openAt = (dock: string): string => `/#/?pg=1&dock=${dock}`;

test.describe('Request body types', () => {
  test.beforeEach(async ({ page, playground }) => {
    await page.goto(openAt('bottom'));
    await playground.treeItems.filter({ hasText: 'get users' }).first().click();
    await expect(page).toHaveURL(/pgReq=/);
    await playground.selectTab('body');
  });

  test('selecting Multipart Form shows the multipart field editor', async ({ requestBody }) => {
    await requestBody.selectType('multipart-form');
    await expect(requestBody.multipart).toBeVisible();
  });

  test('selecting File / Binary shows the referenced-path view', async ({ requestBody }) => {
    await requestBody.selectType('file');
    await expect(requestBody.file).toBeVisible();
  });

  test('switching back to None clears the editor to the empty prompt', async ({ requestBody }) => {
    await requestBody.selectType('multipart-form');
    await expect(requestBody.multipart).toBeVisible();
    await requestBody.selectType('none');
    await expect(requestBody.empty).toBeVisible();
    await expect(requestBody.multipart).toHaveCount(0);
  });
});
