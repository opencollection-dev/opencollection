import { test, expect } from '@fixtures';

// Default theme follows the OS preference; pin it so "starts light" is deterministic.
test.use({ colorScheme: 'light' });

test('toggle switches data-theme and persists across reload', async ({ layoutPage }) => {
  await layoutPage.goto();
  await expect(layoutPage.html).toHaveAttribute('data-theme', 'light');

  // Light mode shows "Switch to dark theme"; clicking flips to dark.
  await layoutPage.themeToggle.switchToDark();
  await expect(layoutPage.html).toHaveAttribute('data-theme', 'dark');
  // Now in dark mode the toggle offers "Switch to light theme".
  await expect(layoutPage.themeToggle.switchToLightButton).toBeVisible();

  await layoutPage.reload();
  await expect(layoutPage.html).toHaveAttribute('data-theme', 'dark');
});

test('renders on mobile, tablet, and large viewports', async ({ layoutPage, page }) => {
  for (const size of [
    { width: 390, height: 800 },
    { width: 768, height: 1024 },
    { width: 1280, height: 900 }
  ]) {
    await page.setViewportSize(size);
    await layoutPage.goto();
    await expect(layoutPage.root).toBeVisible();
  }
});
