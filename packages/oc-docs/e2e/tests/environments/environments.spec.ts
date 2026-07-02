import { test, expect } from '../../playwright';

test.describe('Environments page', () => {
  test.beforeEach(async ({ environmentsPage }) => {
    await environmentsPage.open();
  });

  test('opens from the sidebar and shows a tab per environment', async ({ environmentsPage }) => {
    await expect(environmentsPage.title).toHaveText('Environments');
    await expect(environmentsPage.tabs).toHaveCount(2);
    await expect(environmentsPage.tab('Local')).toBeVisible();
    await expect(environmentsPage.tab('Prod')).toBeVisible();
  });

  test('selects the first environment by default', async ({ environmentsPage }) => {
    await expect(environmentsPage.tab('Local')).toHaveAttribute('aria-selected', 'true');
    await expect(environmentsPage.tab('Prod')).toHaveAttribute('aria-selected', 'false');
  });

  test('lists the active environment variables with their value and data type', async ({ environmentsPage }) => {
    const { table } = environmentsPage;

    await test.step('the Variables group is shown', async () => {
      await expect(environmentsPage.variablesGroup).toBeVisible();
    });

    await test.step('the host variable shows its value and a String data type', async () => {
      await expect(table.variableRow('host')).toBeVisible();
      await expect(table.valueOf('host')).toContainText('http://localhost:8081');
      await expect(table.dataTypeOf('host')).toHaveText('String');
    });
  });

  test('shows secret variables masked under a Secret Variables group', async ({ environmentsPage }) => {
    const { table } = environmentsPage;
    const row = table.secretVariableRow('bearer_auth_token');

    await expect(environmentsPage.secretVariablesGroup).toBeVisible();
    await expect(row).toBeVisible();
    await expect(row).toContainText('Secret');
    await expect(row).not.toContainText('your_secret_token');
  });

  test('switches the table when another environment tab is selected', async ({ environmentsPage }) => {
    const { table } = environmentsPage;

    await expect(table.valueOf('host')).toContainText('http://localhost:8081');

    await environmentsPage.tab('Prod').click();

    await expect(environmentsPage.tab('Prod')).toHaveAttribute('aria-selected', 'true');
    await expect(table.valueOf('host')).toContainText('https://echo.usebruno.com');
  });

  test('renders an accessible columnar table with Name, Value and Data Type headers', async ({ environmentsPage }) => {
    const { table } = environmentsPage;
    await expect(table.columnHeader('name')).toHaveText('Name');
    await expect(table.columnHeader('value')).toHaveText('Value');
    await expect(table.columnHeader('type')).toHaveText('Data Type');
  });

  test('hides the External Secret Variables section when the environment has none', async ({ environmentsPage }) => {
    await expect(environmentsPage.tab('Local')).toHaveAttribute('aria-selected', 'true');
    await expect(environmentsPage.externalSecretsGroup).toBeHidden();
  });

  test('shows external secrets with the manager label and reference for the Prod environment', async ({
    environmentsPage
  }) => {
    const { table } = environmentsPage;

    await environmentsPage.tab('Prod').click();

    await test.step('the External Secret Variables group is shown with its manager', async () => {
      await expect(environmentsPage.externalSecretsGroup).toBeVisible();
      await expect(environmentsPage.externalSecretsGroup).toContainText('AWS Secrets Manager');
    });

    await test.step('each external secret lists its name and secret reference', async () => {
      await expect(table.externalSecretRow('dbPassword')).toContainText('prod/db/credentials');
      await expect(table.externalSecretRow('apiKey')).toContainText('prod/payment-gateway/api-key');
    });

    await test.step('external secrets without a type show an empty data type', async () => {
      await expect(table.externalSecretRow('dbPassword')).toContainText('(empty)');
    });
  });
});
