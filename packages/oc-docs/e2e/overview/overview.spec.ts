import { test, expect, buildOverviewLocators, gotoOverview } from '../utils';

/**
 * Overview flow for the bundled sample collection ("Bruno Testbench"):
 * version + name header, stat counters, environments list, and the
 * collection configuration (headers, auth, scripts, tests).
 */
test.describe('Collection Overview', () => {
  test.beforeEach(async ({ page }) => {
    await gotoOverview(page);
  });

  test('renders the version and collection name in the header', async ({ page }) => {
    const overview = buildOverviewLocators(page);

    await test.step('shows the v-prefixed collection version', async () => {
      await expect(overview.header.version()).toHaveText('v1.0.0');
    });

    await test.step('shows the collection name as the page title', async () => {
      await expect(overview.header.title()).toHaveText('Bruno Testbench');
    });
  });

  test('shows request, folder and environment counts', async ({ page }) => {
    const overview = buildOverviewLocators(page);

    await expect(overview.stats.all()).toHaveCount(3);
    await expect(overview.stats.value('Requests')).toHaveText('10');
    await expect(overview.stats.value('Folders')).toHaveText('0');
    await expect(overview.stats.value('Environments')).toHaveText('2');
  });

  test('lists each environment with its variable count', async ({ page }) => {
    const overview = buildOverviewLocators(page);

    await test.step('shows the Environments section', async () => {
      await expect(overview.sectionLabel('Environments')).toBeVisible();
    });

    await test.step('lists Local and Prod', async () => {
      await expect(overview.environments.items()).toHaveCount(2);
      await expect(overview.environments.item('Local')).toBeVisible();
      await expect(overview.environments.item('Prod')).toBeVisible();
    });

    await test.step('shows each environment variable count', async () => {
      await expect(overview.environments.variableCount('Local')).toHaveText('2 variables');
      await expect(overview.environments.variableCount('Prod')).toHaveText('2 variables');
    });
  });

  test('renders the overview documentation section', async ({ page }) => {
    const overview = buildOverviewLocators(page);

    await expect(overview.sectionLabel('Overview')).toBeVisible();
    await expect(overview.docs.content()).toBeVisible();
    await expect(overview.docs.heading('Getting Started')).toBeVisible();
  });

  test.describe('Collection Configuration', () => {
    test('renders the headers, auth, script and tests groups', async ({ page }) => {
      const overview = buildOverviewLocators(page);

      await expect(overview.sectionLabel('Collection Configuration')).toBeVisible();

      await test.step('Headers group shows the collection header', async () => {
        await expect(overview.configuration.subHeading('Headers')).toBeVisible();
        await expect(overview.configuration.rowValue('collection-header')).toHaveText('collection-header-value');
      });

      await test.step('Auth group shows the resolved auth mode', async () => {
        await expect(overview.configuration.subHeading('Auth')).toBeVisible();
        await expect(overview.configuration.rowValue('Mode')).toHaveText('Bearer Token');
      });

      await test.step('Script and Tests groups are present', async () => {
        await expect(overview.configuration.subHeading('Script')).toBeVisible();
        await expect(overview.configuration.subHeading('Tests')).toBeVisible();
      });
    });

    test('masks the auth token until the reveal toggle is clicked', async ({ page }) => {
      const overview = buildOverviewLocators(page);
      const secret = overview.configuration.secret();

      await test.step('the token is masked by default', async () => {
        await expect(secret).toContainText('•');
        await expect(secret).not.toHaveText('{{bearer_auth_token}}');
      });

      await test.step('clicking the toggle reveals the raw token', async () => {
        await overview.configuration.revealSecretButton().click();
        await expect(secret).toHaveText('{{bearer_auth_token}}');
      });
    });

    test('copies a code snippet to the clipboard', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      const overview = buildOverviewLocators(page);
      const copyButton = overview.configuration.copyButtons().first();

      await test.step('clicking copy confirms with the "Copied" label', async () => {
        await copyButton.click();
        await expect(copyButton).toHaveAttribute('aria-label', 'Copied');
      });
    });
  });
});
