import { test, expect } from '../../playwright';

/**
 * The header has one button that flips the whole app between light and dark.
 */
test.describe('Theme switcher', () => {
  test.use({ colorScheme: 'light' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('starts in light mode and offers to switch to dark', async ({ page, themeToggle }) => {
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(themeToggle.button).toHaveAccessibleName('Switch to dark theme');
  });

  test('turns the app dark when the switch is clicked', async ({ page, themeToggle }) => {
    await themeToggle.toggle();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    // The switch now offers the opposite action.
    await expect(themeToggle.button).toHaveAccessibleName('Switch to light theme');
  });

  test('turns the app back to light when switched again', async ({ page, themeToggle }) => {
    await themeToggle.toggle();
    await themeToggle.toggle();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('remembers the chosen theme after a page reload', async ({ page, themeToggle }) => {
    await themeToggle.toggle();
    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});
