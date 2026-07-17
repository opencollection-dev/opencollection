import { test, expect } from '../../playwright';

test.describe('Request body types', () => {
  test.beforeEach(async ({ page, playground }) => {
    await playground.open('bottom');
    await playground.openRequest('get users');
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

  test('opens the body-type menu when Enter is pressed on the focused trigger', async ({ requestBody }) => {
    await requestBody.openWithKeyboard('Enter');
    await expect(requestBody.option('multipart-form')).toBeVisible();
  });

  test('opens the body-type menu when Space is pressed on the focused trigger', async ({ requestBody }) => {
    await requestBody.openWithKeyboard(' ');
    await expect(requestBody.option('multipart-form')).toBeVisible();
  });
});
