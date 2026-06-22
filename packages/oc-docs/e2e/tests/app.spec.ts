import { test, expect } from '../fixtures';

test('app loads and renders the collection', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#root')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bruno Testbench' }).first()).toBeVisible();
});
