import { test, expect } from '../../playwright';

/**
 * Environment switcher + show-variables toggle in the page header. The sample
 * collection ("Bruno Testbench") ships two environments (Local and Prod),
 * with Local active by default.
 */
test.describe('Environment switcher', () => {
  test.beforeEach(async ({ overviewPage }) => {
    await overviewPage.goto();
  });

  test('shows the active environment and offers the others', async ({ envSwitcher }) => {
    await expect(envSwitcher.trigger).toBeVisible();
    await expect(envSwitcher.trigger).toContainText('Local');

    await test.step('opening the switcher lists every environment', async () => {
      await envSwitcher.open();
      await expect(envSwitcher.menu).toBeVisible();
      await expect(envSwitcher.option('Local')).toBeVisible();
      await expect(envSwitcher.option('Prod')).toBeVisible();
      await expect(envSwitcher.option('Local')).toHaveAttribute('aria-current', 'true');
    });
  });

  test('selecting an environment makes it the active one', async ({ envSwitcher }) => {
    await envSwitcher.selectEnvironment('Prod');

    await expect(envSwitcher.trigger).toContainText('Prod');
    await envSwitcher.open();
    await expect(envSwitcher.option('Prod')).toHaveAttribute('aria-current', 'true');
  });

  test('the show-variables toggle flips on and off', async ({ envSwitcher }) => {
    await expect(envSwitcher.showVarsToggle).toHaveAttribute('aria-checked', 'false');

    await envSwitcher.toggle();
    await expect(envSwitcher.showVarsToggle).toHaveAttribute('aria-checked', 'true');

    await envSwitcher.toggle();
    await expect(envSwitcher.showVarsToggle).toHaveAttribute('aria-checked', 'false');
  });

  test('persists the active environment and show-vars state across a reload', async ({ page, envSwitcher }) => {
    await envSwitcher.selectEnvironment('Prod');
    await envSwitcher.toggle();
    await expect(envSwitcher.showVarsToggle).toHaveAttribute('aria-checked', 'true');

    await page.reload();

    await expect(envSwitcher.trigger).toContainText('Prod');
    await expect(envSwitcher.showVarsToggle).toHaveAttribute('aria-checked', 'true');
  });
});
