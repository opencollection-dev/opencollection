import { test, expect } from '@playwright/test';

// Default theme follows the OS preference; pin it so "starts light" is deterministic.
test.use({ colorScheme: 'light' });

test('toggle switches data-theme and persists across reload', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'light');

  // Light mode shows "Switch to dark theme"; clicking flips to dark.
  await page.getByRole('button', { name: /switch to dark theme/i }).click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  // Now in dark mode the button offers "Switch to light theme".
  await expect(page.getByRole('button', { name: /switch to light theme/i })).toBeVisible();

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
