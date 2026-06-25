import { test, expect } from '../../playwright';

/**
 * The header has one button that flips the whole app between light and dark.
 */
test.describe('Theme switcher', () => {
  test.use({ colorScheme: 'light' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('starts in light mode, with the toggle offering "Switch to dark theme"', async ({ page, themeToggle }) => {
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(themeToggle.button).toHaveAccessibleName('Switch to dark theme');
  });

  test('switches the whole app to dark mode when the toggle is clicked', async ({ page, themeToggle }) => {
    await themeToggle.toggle();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    // The toggle now offers the opposite action.
    await expect(themeToggle.button).toHaveAccessibleName('Switch to light theme');
  });

  test('switches back to light mode when the toggle is clicked again', async ({ page, themeToggle }) => {
    await themeToggle.toggle();
    await themeToggle.toggle();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('remembers the chosen theme across a page reload', async ({ page, themeToggle }) => {
    await themeToggle.toggle();
    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});
