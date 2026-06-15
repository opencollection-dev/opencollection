import { test, expect } from '@playwright/test';

test('toggle switches data-theme and persists across reload', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'light');

  await page.getByRole('button', { name: /toggle light\/dark theme/i }).click();
  await expect(html).toHaveAttribute('data-theme', 'dark');

  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');
});

test('renders on mobile, tablet, and large viewports', async ({ page }) => {
  for (const size of [
    { width: 390, height: 800 },
    { width: 768, height: 1024 },
    { width: 1280, height: 900 },
  ]) {
    await page.setViewportSize(size);
    await page.goto('/');
    await expect(page.locator('#root')).toBeVisible();
  }
});
