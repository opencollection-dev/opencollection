import { test, expect } from '../../playwright';
import { EnvSwitcherComponent } from '../../components/layout/env-switcher.component';

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

  test('Escape closes the open menu', async ({ envSwitcher }) => {
    await envSwitcher.open();
    await expect(envSwitcher.menu).toBeVisible();

    await envSwitcher.pressKey('Escape');
    await expect(envSwitcher.menu).toBeHidden();
    await expect(envSwitcher.trigger).toContainText('Local');
  });

  test('clicking outside the menu closes it', async ({ page, envSwitcher }) => {
    await envSwitcher.open();
    await expect(envSwitcher.menu).toBeVisible();

    await page.mouse.click(5, 5);
    await expect(envSwitcher.menu).toBeHidden();
    await expect(envSwitcher.trigger).toContainText('Local');
  });

  test('keyboard navigation reaches and activates an option', async ({ envSwitcher }) => {
    await envSwitcher.open();
    await expect(envSwitcher.menu).toBeVisible();
    await expect(envSwitcher.option('Local')).toBeFocused();

    await envSwitcher.pressKey('ArrowDown');
    await expect(envSwitcher.option('Prod')).toBeFocused();

    await envSwitcher.pressKey('Enter');
    await expect(envSwitcher.menu).toBeHidden();
    await expect(envSwitcher.trigger).toContainText('Prod');
  });
});

/**
 * The playground surfaces its own environment switcher in the playground sidebar
 * (`playground-env-switcher`), a second instance of the same component. Selecting
 * there must switch the active environment the same way the top-nav one does.
 */
test.describe('Playground environment switcher', () => {
  test('selecting an environment from the playground switcher activates it', async ({ page, playground }) => {
    await playground.open('inline');
    await playground.revealSidebar();

    const playgroundEnvSwitcher = new EnvSwitcherComponent(page, 'playground-env-switcher');
    await expect(playgroundEnvSwitcher.trigger).toContainText('Local');

    await playgroundEnvSwitcher.selectEnvironment('Prod');

    await expect(playgroundEnvSwitcher.trigger).toContainText('Prod');
    await playgroundEnvSwitcher.open();
    await expect(playgroundEnvSwitcher.option('Prod')).toHaveAttribute('aria-current', 'true');
  });
});

/**
 * The `no-envs` fixture ships a collection with no environments, so the switcher
 * must degrade to a disabled "No environments" item and reflect that on the
 * trigger rather than offering a selection.
 */
test.describe('Environment switcher with no environments', () => {
  test.beforeEach(async ({ overviewPage }) => {
    await overviewPage.goto('/?fixture=no-envs#/');
  });

  test('shows a disabled empty-state item and reflects it on the trigger', async ({ envSwitcher }) => {
    await expect(envSwitcher.trigger).toContainText('No environments');

    await envSwitcher.open();
    await expect(envSwitcher.emptyOption).toBeVisible();
    await expect(envSwitcher.emptyOption).toHaveAttribute('aria-disabled', 'true');
  });
});
