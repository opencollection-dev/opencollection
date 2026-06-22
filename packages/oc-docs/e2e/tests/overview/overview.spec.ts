import { test, expect } from '../../fixtures';

/**
 * Overview flow for the bundled sample collection ("Bruno Testbench"):
 * version + name header, stat counters, environments list, and the
 * collection configuration (headers, auth, scripts, tests).
 */
test.describe('Collection Overview', () => {
  test.beforeEach(async ({ overviewPage }) => {
    await overviewPage.goto();
  });

  test('renders the version and collection name in the header', async ({ overviewPage }) => {
    await test.step('shows the v-prefixed collection version', async () => {
      await expect(overviewPage.header.version).toHaveText('v1.0.0');
    });

    await test.step('shows the collection name as the page title', async () => {
      await expect(overviewPage.header.title).toHaveText('Bruno Testbench');
    });
  });

  test('shows request, folder and environment counts', async ({ overviewPage }) => {
    await expect(overviewPage.stats.all).toHaveCount(3);
    await expect(overviewPage.stats.value('Requests')).toHaveText('10');
    await expect(overviewPage.stats.value('Folders')).toHaveText('0');
    await expect(overviewPage.stats.value('Environments')).toHaveText('2');
  });

  test('lists each environment with its variable count', async ({ overviewPage }) => {
    await test.step('shows the Environments section', async () => {
      await expect(overviewPage.sectionLabel('Environments')).toBeVisible();
    });

    await test.step('lists Local and Prod', async () => {
      await expect(overviewPage.environments.items).toHaveCount(2);
      await expect(overviewPage.environments.item('Local')).toBeVisible();
      await expect(overviewPage.environments.item('Prod')).toBeVisible();
    });

    await test.step('shows each environment variable count', async () => {
      await expect(overviewPage.environments.variableCount('Local')).toHaveText('2 variables');
      await expect(overviewPage.environments.variableCount('Prod')).toHaveText('2 variables');
    });
  });

  test('renders the overview documentation section', async ({ overviewPage }) => {
    await expect(overviewPage.sectionLabel('Overview')).toBeVisible();
    await expect(overviewPage.docs.content).toBeVisible();
    await expect(overviewPage.docs.heading('Getting Started')).toBeVisible();
  });

  test.describe('Collection Configuration', () => {
    test('renders the headers, auth, script and tests groups', async ({ overviewPage }) => {
      const { configuration } = overviewPage;
      await expect(overviewPage.sectionLabel('Collection Configuration')).toBeVisible();

      await test.step('Headers group shows the collection header', async () => {
        await expect(configuration.subHeading('Headers')).toBeVisible();
        await expect(configuration.rowValue('collection-header')).toHaveText('collection-header-value');
      });

      await test.step('Auth group shows the resolved auth mode', async () => {
        await expect(configuration.subHeading('Auth')).toBeVisible();
        await expect(configuration.rowValue('Mode')).toHaveText('Bearer Token');
      });

      await test.step('Script and Tests groups are present', async () => {
        await expect(configuration.subHeading('Script')).toBeVisible();
        await expect(configuration.subHeading('Tests')).toBeVisible();
      });
    });

    test('masks the auth token until the reveal toggle is clicked', async ({ overviewPage }) => {
      const { secret } = overviewPage.configuration;

      await test.step('the token is masked by default', async () => {
        await expect(secret).toContainText('•');
        await expect(secret).not.toHaveText('{{bearer_auth_token}}');
      });

      await test.step('clicking the toggle reveals the raw token', async () => {
        await overviewPage.configuration.revealSecret();
        await expect(secret).toHaveText('{{bearer_auth_token}}');
      });
    });

    test('copies a code snippet to the clipboard', async ({ overviewPage, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      const copyButton = overviewPage.configuration.copyButtons.first();

      await test.step('clicking copy confirms with the "Copied" label', async () => {
        await copyButton.click();
        await expect(copyButton).toHaveAttribute('aria-label', 'Copied');
      });
    });
  });
});
