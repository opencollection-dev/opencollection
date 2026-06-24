import { test, expect, type Page } from '@playwright/test';

/**
 * Locate an endpoint section by its h1 title (mirrors requests.spec.ts).
 */
function endpointSection(page: Page, name: string) {
  return page.locator('.endpoint-section').filter({
    has: page.getByRole('heading', { name, level: 1, exact: true }),
  });
}

/** Open the try-it playground for an endpoint. */
async function openTryIt(page: Page, endpoint: string) {
  await endpointSection(page, endpoint).getByRole('button', { name: 'Try' }).click();
}

test.describe('Try-it request failure messages (BRU-3408)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.endpoint-section');
  });

  test('cross-origin failure is classified as browser-blocked (CORS), inside the Response tab', async ({ page }) => {
    // The sample collection targets localhost:8081 — a different origin than the
    // docs page (127.0.0.1:3001). Aborting reproduces the opaque failure.
    await page.route('**/api/users**', (route) => route.abort());

    await openTryIt(page, 'get users');
    await page.getByRole('button', { name: 'SEND' }).click();

    await expect(page.locator('.error-title')).toHaveText('Request blocked');
    await expect(page.locator('.error-message')).toContainText('usually CORS');
    await expect(page.locator('.error-message')).toContainText('Bruno desktop app');

    // Banner renders inside the Response tab shell, not as a full-pane replacement.
    await expect(page.getByRole('button', { name: 'Response', exact: true })).toBeVisible();
  });

  test('same-origin failure is "unreachable" and never mentions CORS', async ({ page }) => {
    // Point the request at the docs page's own origin, then fail it.
    await page.route('**/same-origin-fail**', (route) => route.abort());

    await openTryIt(page, 'get users');
    await page.getByPlaceholder('Enter request URL').fill('http://127.0.0.1:3001/same-origin-fail');
    await page.getByRole('button', { name: 'SEND' }).click();

    await expect(page.locator('.error-title')).toHaveText("Couldn't reach the server");
    const message = (await page.locator('.error-message').innerText()).toLowerCase();
    expect(message).toContain('may be down');
    expect(message).not.toContain('cors');
  });

  test('a 4xx response is NOT treated as a failure (renders normally)', async ({ page }) => {
    await page.route('**/api/users**', (route) =>
      route.fulfill({
        status: 404,
        headers: { 'access-control-allow-origin': '*' },
        contentType: 'application/json',
        body: JSON.stringify({ error: 'not found' }),
      })
    );

    await openTryIt(page, 'get users');
    await page.getByRole('button', { name: 'SEND' }).click();

    // No error banner; a 404 is a normal response (status shown).
    await expect(page.locator('.error-title')).toHaveCount(0);
    await expect(page.getByText('404 Not Found')).toBeVisible();
  });
});
