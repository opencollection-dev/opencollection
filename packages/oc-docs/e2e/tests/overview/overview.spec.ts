import { test, expect } from '../../utils';
import { OverviewPage } from '../../pages/OverviewPage';

/**
 * Overview flow for the bundled sample collection ("Bruno Testbench"):
 * version + name header, stat counters, environments list, and the
 * collection configuration (headers, auth, scripts, tests).
 */
test.describe('Collection Overview', () => {
  let overview: OverviewPage;

  test.beforeEach(async ({ page }) => {
    overview = new OverviewPage(page);
    await overview.goto();
  });

  test('renders the version and collection name in the header', async () => {
    await test.step('shows the v-prefixed collection version', async () => {
      await expect(overview.locators.header.version()).toHaveText('v1.0.0');
    });

    await test.step('shows the collection name as the page title', async () => {
      await expect(overview.locators.header.title()).toHaveText('Bruno Testbench');
    });
  });

  test('shows request, folder and environment counts', async () => {
    await expect(overview.locators.stats.all()).toHaveCount(3);
    await expect(overview.locators.stats.value('Requests')).toHaveText('10');
    await expect(overview.locators.stats.value('Folders')).toHaveText('0');
    await expect(overview.locators.stats.value('Environments')).toHaveText('2');
  });

  test('lists each environment with its variable count', async () => {
    await test.step('shows the Environments section', async () => {
      await expect(overview.locators.sectionLabel('Environments')).toBeVisible();
    });

    await test.step('lists Local and Prod', async () => {
      await expect(overview.locators.environments.items()).toHaveCount(2);
      await expect(overview.locators.environments.item('Local')).toBeVisible();
      await expect(overview.locators.environments.item('Prod')).toBeVisible();
    });

    await test.step('shows each environment variable count', async () => {
      await expect(overview.locators.environments.variableCount('Local')).toHaveText('2 variables');
      await expect(overview.locators.environments.variableCount('Prod')).toHaveText('2 variables');
    });
  });

  test('renders the overview documentation section', async () => {
    await expect(overview.locators.sectionLabel('Overview')).toBeVisible();
    await expect(overview.locators.docs.content()).toBeVisible();
    await expect(overview.locators.docs.heading('Getting Started')).toBeVisible();
  });

  test.describe('Collection Configuration', () => {
    test('renders the headers, auth, script and tests groups', async () => {
      await expect(overview.locators.sectionLabel('Collection Configuration')).toBeVisible();

      await test.step('Headers group shows the collection header', async () => {
        await expect(overview.locators.configuration.subHeading('Headers')).toBeVisible();
        await expect(overview.locators.configuration.rowValue('collection-header')).toHaveText('collection-header-value');
      });

      await test.step('Auth group shows the resolved auth mode', async () => {
        await expect(overview.locators.configuration.subHeading('Auth')).toBeVisible();
        await expect(overview.locators.configuration.rowValue('Mode')).toHaveText('Bearer Token');
      });

      await test.step('Script and Tests groups are present', async () => {
        await expect(overview.locators.configuration.subHeading('Script')).toBeVisible();
        await expect(overview.locators.configuration.subHeading('Tests')).toBeVisible();
      });
    });

    test('masks the auth token until the reveal toggle is clicked', async () => {
      const secret = overview.locators.configuration.secret();

      await test.step('the token is masked by default', async () => {
        await expect(secret).toContainText('•');
        await expect(secret).not.toHaveText('{{bearer_auth_token}}');
      });

      await test.step('clicking the toggle reveals the raw token', async () => {
        await overview.locators.configuration.revealSecretButton().click();
        await expect(secret).toHaveText('{{bearer_auth_token}}');
      });
    });

    test('copies a code snippet to the clipboard', async ({ context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      const copyButton = overview.locators.configuration.copyButtons().first();

      await test.step('clicking copy confirms with the "Copied" label', async () => {
        await copyButton.click();
        await expect(copyButton).toHaveAttribute('aria-label', 'Copied');
      });
    });
  });
});
