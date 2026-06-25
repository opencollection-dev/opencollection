import { test, expect } from '../../playwright';

test.describe('Collection Overview', () => {
  test.beforeEach(async ({ overviewPage }) => {
    await overviewPage.goto();
  });

  test('header shows the collection version ("v1.0.0") and name ("Bruno Testbench")', async ({ overviewPage }) => {
    await test.step('the version is shown with a "v" prefix', async () => {
      await expect(overviewPage.header.collectionVersion).toHaveText('v1.0.0');
    });

    await test.step('the collection name is shown as the page title', async () => {
      await expect(overviewPage.header.collectionName).toHaveText('Bruno Testbench');
    });
  });

  test('shows three stat cards with the request (38), folder (6) and environment (2) counts', async ({ overviewPage }) => {
    await expect(overviewPage.stats.cards).toHaveCount(3);
    await expect(overviewPage.stats.valueFor('Requests')).toHaveText('38');
    await expect(overviewPage.stats.valueFor('Folders')).toHaveText('6');
    await expect(overviewPage.stats.valueFor('Environments')).toHaveText('2');
  });

  test('lists every environment under the "Environments" section with its variable count', async ({ overviewPage }) => {
    await test.step('the "Environments" section is shown', async () => {
      await expect(overviewPage.sectionLabel('Environments')).toBeVisible();
    });

    await test.step('both environments (Local and Prod) are listed', async () => {
      await expect(overviewPage.environments.items).toHaveCount(2);
      await expect(overviewPage.environments.item('Local')).toBeVisible();
      await expect(overviewPage.environments.item('Prod')).toBeVisible();
    });

    await test.step('each environment shows how many variables it has', async () => {
      await expect(overviewPage.environments.variableCount('Local')).toHaveText('2 variables');
      await expect(overviewPage.environments.variableCount('Prod')).toHaveText('2 variables');
    });
  });

  test('renders the collection documentation under the "Overview" section', async ({ overviewPage }) => {
    await expect(overviewPage.sectionLabel('Overview')).toBeVisible();
    await expect(overviewPage.docMarkdown.root).toBeVisible();
    await expect(overviewPage.docMarkdown.heading('Getting Started')).toBeVisible();
  });

  test.describe('Collection Configuration', () => {
    test('shows the Headers, Auth, Script and Tests groups with their values', async ({ overviewPage }) => {
      const { configuration } = overviewPage;
      await expect(overviewPage.sectionLabel('Collection Configuration')).toBeVisible();

      await test.step('the Headers group lists the collection-level header and its value', async () => {
        await expect(configuration.subHeading('Headers')).toBeVisible();
        await expect(configuration.root.getByText('collection-header-value')).toBeVisible();
      });

      await test.step('the Auth group shows the resolved auth mode (Bearer Token)', async () => {
        await expect(configuration.subHeading('Auth')).toBeVisible();
        await expect(configuration.root.getByText('Bearer Token')).toBeVisible();
      });

      await test.step('the Script and Tests groups are present', async () => {
        await expect(configuration.subHeading('Script')).toBeVisible();
        await expect(configuration.subHeading('Tests')).toBeVisible();
      });
    });

    test('shows the collection auth token masked, not in plain text', async ({ overviewPage }) => {
      const { configuration } = overviewPage;
      await expect(configuration.root).toContainText('•');
      await expect(configuration.root).not.toContainText('{{bearer_auth_token}}');
    });
  });
});
