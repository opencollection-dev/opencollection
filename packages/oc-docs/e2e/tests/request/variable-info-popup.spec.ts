import { test, expect } from '../../playwright';

const GET_ALL_CUSTOMERS = ['billing', 'customers', 'Get All Customers'];

const hostVar = (page: import('@playwright/test').Page) =>
  page.locator('[data-testid="request-section-headers"] .var').filter({ hasText: '{{host}}' }).first();
const tokenVar = (page: import('@playwright/test').Page) =>
  page.locator('[data-testid="request-section-headers"] .var').filter({ hasText: '{{bearer_auth_token}}' }).first();
const popup = (page: import('@playwright/test').Page) => page.locator('.oc-tooltip[data-testid="variable-info"]');

test.describe('Variable info popup', () => {
  test('hovering a variable reference shows its scope and value (read-only)', async ({ requestPage, page }) => {
    await requestPage.open(GET_ALL_CUSTOMERS);

    await hostVar(page).hover();
    await expect(popup(page)).toBeVisible();
    await expect(popup(page)).toContainText('Environment');
    await expect(popup(page)).toContainText('http://localhost:8081'); // first environment (Local) by default
  });

  test('the environment selector changes the value resolved in the popup', async ({ requestPage, page }) => {
    await requestPage.open(GET_ALL_CUSTOMERS);

    await page.getByTestId('environment-switcher').click();
    await page.getByTestId('environment-switcher-option').filter({ hasText: 'Prod' }).click();

    await hostVar(page).hover();
    await expect(popup(page)).toBeVisible();
    await expect(popup(page)).toContainText('https://echo.usebruno.com'); // Prod value
  });

  test('a secret variable reference is masked and its value never shown', async ({ requestPage, page }) => {
    await requestPage.open(GET_ALL_CUSTOMERS);

    await tokenVar(page).hover();
    await expect(popup(page)).toBeVisible();
    await expect(popup(page)).toContainText('Environment');
    await expect(popup(page)).not.toContainText('your_secret_token');
    // Secrets have no copyable value.
    await expect(popup(page).getByTestId('variable-info-copy')).toHaveCount(0);
  });

  test('the value can be copied from the popup', async ({ requestPage, page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await requestPage.open(GET_ALL_CUSTOMERS);

    await hostVar(page).hover();
    await expect(popup(page)).toBeVisible();
    await popup(page).getByTestId('variable-info-copy').click();

    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toBe('http://localhost:8081');
  });
});
