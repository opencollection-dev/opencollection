import { test, expect } from '../../playwright';

/**
 * A failed try-it request shows a contextual error banner (BRU-3408): a
 * cross-origin abort is classified as browser-blocked (CORS), a same-origin
 * abort as unreachable, and a 4xx is a normal response (no banner).
 */
test.describe('Try-it request failure messages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('endpoint-section').first().waitFor();
  });

  test('cross-origin failure is classified as browser-blocked (CORS), inside the Response tab', async ({ page, requestPlayground }) => {
    // The sample collection targets localhost:8081 — a different origin than the
    // docs page (127.0.0.1:3001). Aborting reproduces the opaque failure.
    await page.route('**/api/users**', (route) => route.abort());

    await requestPlayground.open('get users');
    await requestPlayground.send();

    await expect(requestPlayground.errorTitle).toHaveText('Request blocked');
    await expect(requestPlayground.errorMessage).toContainText('usually CORS');
    await expect(requestPlayground.errorMessage).toContainText('Bruno desktop app');

    // Banner renders inside the Response tab shell, not as a full-pane replacement.
    await expect(requestPlayground.responseTab).toBeVisible();
  });

  test('same-origin failure is "unreachable" and never mentions CORS', async ({ page, requestPlayground }) => {
    // Point the request at the docs page's own origin, then fail it.
    await page.route('**/same-origin-fail**', (route) => route.abort());

    await requestPlayground.open('get users');
    await requestPlayground.setUrl('http://127.0.0.1:3001/same-origin-fail');
    await requestPlayground.send();

    await expect(requestPlayground.errorTitle).toHaveText("Couldn't reach the server");
    const message = (await requestPlayground.errorMessage.innerText()).toLowerCase();
    expect(message).toContain('may be down');
    expect(message).not.toContain('cors');
  });

  test('a 4xx response is NOT treated as a failure (renders normally)', async ({ page, requestPlayground }) => {
    await page.route('**/api/users**', (route) =>
      route.fulfill({
        status: 404,
        headers: { 'access-control-allow-origin': '*' },
        contentType: 'application/json',
        body: JSON.stringify({ error: 'not found' }),
      })
    );

    await requestPlayground.open('get users');
    await requestPlayground.send();

    // No error banner; a 404 is a normal response (status shown).
    await expect(requestPlayground.errorTitle).toHaveCount(0);
    await expect(page.getByText('404 Not Found')).toBeVisible();
  });
});
