import { test, expect, type Page } from '@playwright/test';

// Skipped: the BRU-2571 Overview revamp renders only the Overview at `/` and
// disabled the all-endpoints view in Docs.tsx, so `.endpoint-section` (and the
// method badges, headers, bodies, params, docs and code snippets nested in it)
// no longer exist on the page. Re-enable these specs (drop the `.skip`) once the
// endpoints view is restored or relocated.

/**
 * Helper to locate an endpoint section by its h1 title.
 * Using heading role avoids case-insensitive hasText matching
 * against example tab names or body content in other sections.
 */
function endpointSection(page: Page, name: string) {
  return page.locator('.endpoint-section').filter({
    has: page.getByRole('heading', { name, level: 1, exact: true }),
  });
}

test.describe.skip('HTTP method badges and URLs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.endpoint-section');
  });

  test('POST request shows method badge', async ({ page }) => {
    const section = endpointSection(page, 'echo json');
    await expect(section.locator('.badge-method')).toContainText('POST');
  });

  test('GET request shows method badge', async ({ page }) => {
    const section = endpointSection(page, 'get users');
    await expect(section.locator('.badge-method')).toContainText('GET');
  });

  test('PUT request renders with method and URL', async ({ page }) => {
    const section = endpointSection(page, 'update user');
    await expect(section.locator('.badge-method')).toContainText('PUT');
    await expect(section.locator('.badge-url')).toContainText('/api/users/1');
  });

  test('PATCH request renders with method badge', async ({ page }) => {
    const section = endpointSection(page, 'patch user');
    await expect(section.locator('.badge-method')).toContainText('PATCH');
  });

  test('DELETE request renders with method badge', async ({ page }) => {
    const section = endpointSection(page, 'delete user');
    await expect(section.locator('.badge-method')).toContainText('DELETE');
  });

  test('URL displays with variable placeholders', async ({ page }) => {
    const section = endpointSection(page, 'echo json');
    await expect(section.locator('.badge-url')).toContainText('{{host}}/api/echo/json');
  });
});

test.describe.skip('Request headers table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.endpoint-section');
  });

  test('renders headers with name and value columns', async ({ page }) => {
    const section = endpointSection(page, 'echo json');
    const headersSection = section.locator('.minimal-table').filter({ hasText: 'Headers' });

    await expect(headersSection.locator('th', { hasText: 'Name' })).toBeVisible();
    await expect(headersSection.locator('th', { hasText: 'Value' })).toBeVisible();
    await expect(headersSection.getByRole('cell', { name: 'Content-Type', exact: true })).toBeVisible();
    await expect(headersSection.getByRole('cell', { name: 'application/json', exact: true })).toBeVisible();
  });

  test('disabled headers still render in the table', async ({ page }) => {
    const section = endpointSection(page, 'update user');
    const headersTable = section.locator('.minimal-table').filter({ hasText: 'Headers' });

    const disabledRow = headersTable.locator('tr').filter({ hasText: 'X-Deprecated-Header' });
    await expect(disabledRow).toBeVisible();
    await expect(disabledRow.getByRole('cell', { name: 'old-value', exact: true })).toBeVisible();
  });

  test('multiple headers render in separate rows', async ({ page }) => {
    const section = endpointSection(page, 'update user');
    const headersTable = section.locator('.minimal-table').filter({ hasText: 'Headers' });

    await expect(headersTable.getByRole('cell', { name: 'Content-Type', exact: true })).toBeVisible();
    await expect(headersTable.getByRole('cell', { name: 'Authorization', exact: true })).toBeVisible();
    await expect(headersTable.getByRole('cell', { name: 'X-Deprecated-Header', exact: true })).toBeVisible();
  });
});

test.describe.skip('Request body rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.endpoint-section');
  });

  test('JSON body renders in code view', async ({ page }) => {
    const section = endpointSection(page, 'echo json');
    const bodySection = section.locator('.request-body-section');

    await expect(bodySection.locator('.section-title', { hasText: 'Body' })).toBeVisible();
    await expect(bodySection).toContainText('request-level-variable');
  });

  test('form-urlencoded body renders as key=value pairs', async ({ page }) => {
    const section = endpointSection(page, 'submit form');
    const bodySection = section.locator('.request-body-section');

    await expect(bodySection).toBeVisible();
    await expect(bodySection).toContainText('name=Alice');
    await expect(bodySection).toContainText('email=alice%40example.com');
    await expect(bodySection).toContainText('message=Hello');
    // "debug=true" is disabled, should be filtered out
    await expect(bodySection).not.toContainText('debug');
  });

  test('multipart-form body renders as name: value pairs', async ({ page }) => {
    const section = endpointSection(page, 'upload file');
    const bodySection = section.locator('.request-body-section');

    await expect(bodySection).toBeVisible();
    await expect(bodySection).toContainText('file: /path/to/document.pdf');
    await expect(bodySection).toContainText('description: Quarterly report');
    await expect(bodySection).toContainText('tags: report,quarterly');
  });

  test('XML body renders in code view', async ({ page }) => {
    const section = endpointSection(page, 'xml payload');
    const bodySection = section.locator('.request-body-section');

    await expect(bodySection).toBeVisible();
    await expect(bodySection).toContainText('soap:Envelope');
    await expect(bodySection).toContainText('GetUserInfo');
  });

  test('PUT request with JSON body renders correctly', async ({ page }) => {
    const section = endpointSection(page, 'update user');
    const bodySection = section.locator('.request-body-section');

    await expect(bodySection).toBeVisible();
    await expect(bodySection).toContainText('Jane Doe');
    await expect(bodySection).toContainText('jane@example.com');
  });

  test('PATCH request with partial JSON body renders', async ({ page }) => {
    const section = endpointSection(page, 'patch user');
    const bodySection = section.locator('.request-body-section');

    await expect(bodySection).toBeVisible();
    await expect(bodySection).toContainText('moderator');
  });

  test('GET request without body does not show body section', async ({ page }) => {
    const section = endpointSection(page, 'get users');
    await expect(section.locator('.request-body-section')).not.toBeVisible();
  });

  test('DELETE request without body does not show body section', async ({ page }) => {
    const section = endpointSection(page, 'delete user');
    await expect(section.locator('.request-body-section')).not.toBeVisible();
  });
});

test.describe.skip('Query parameters table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.endpoint-section');
  });

  test('renders query parameters with name and value', async ({ page }) => {
    const section = endpointSection(page, 'search users');
    const paramsTable = section.locator('.minimal-table').filter({ hasText: 'Query Parameters' });

    await expect(paramsTable).toBeVisible();
    await expect(paramsTable.getByRole('cell', { name: 'q', exact: true })).toBeVisible();
    await expect(paramsTable.getByRole('cell', { name: 'alice', exact: true })).toBeVisible();
    await expect(paramsTable.getByRole('cell', { name: 'role', exact: true })).toBeVisible();
    await expect(paramsTable.getByRole('cell', { name: 'admin', exact: true })).toBeVisible();
    await expect(paramsTable.getByRole('cell', { name: 'status', exact: true })).toBeVisible();
    await expect(paramsTable.getByRole('cell', { name: 'active', exact: true })).toBeVisible();
  });

  test('disabled query params still render in the table', async ({ page }) => {
    const section = endpointSection(page, 'search users');
    const paramsTable = section.locator('.minimal-table').filter({ hasText: 'Query Parameters' });

    const row = paramsTable.locator('tr').filter({ hasText: 'verbose' });
    await expect(row).toBeVisible();
    await expect(row.getByRole('cell', { name: 'true', exact: true })).toBeVisible();
  });

  test('endpoint without explicit params does not show params table', async ({ page }) => {
    const section = endpointSection(page, 'echo json');
    await expect(section.locator('.minimal-table').filter({ hasText: 'Query Parameters' })).not.toBeVisible();
  });
});

test.describe.skip('Request documentation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.endpoint-section');
  });

  test('renders item-level docs as markdown', async ({ page }) => {
    const section = endpointSection(page, 'get users');
    const docs = section.locator('.item-docs');
    await expect(docs).toBeVisible();
    await expect(docs).toContainText('Retrieve a paginated list of users');
  });

  test('PUT request shows its description', async ({ page }) => {
    const section = endpointSection(page, 'update user');
    await expect(section.locator('.item-docs')).toContainText('Replace an existing user entirely');
  });

  test('PATCH request shows its description', async ({ page }) => {
    const section = endpointSection(page, 'patch user');
    await expect(section.locator('.item-docs')).toContainText('Partially update a user');
  });

  test('DELETE request shows its description', async ({ page }) => {
    const section = endpointSection(page, 'delete user');
    await expect(section.locator('.item-docs')).toContainText('Permanently delete a user');
  });

  test('form endpoint shows its description', async ({ page }) => {
    const section = endpointSection(page, 'submit form');
    await expect(section.locator('.item-docs')).toContainText('Submit a contact form');
  });

  test('endpoint without docs does not show docs section', async ({ page }) => {
    const section = endpointSection(page, 'echo json');
    await expect(section.locator('.item-docs')).not.toBeVisible();
  });
});

test.describe.skip('Code snippets', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.endpoint-section');
  });

  test('renders code snippet section with language tabs', async ({ page }) => {
    const section = endpointSection(page, 'echo json');
    const snippets = section.locator('.code-snippets-wrapper');

    await expect(snippets.locator('button', { hasText: 'cURL' })).toBeVisible();
    await expect(snippets.locator('button', { hasText: 'JavaScript' })).toBeVisible();
    await expect(snippets.locator('button', { hasText: 'Python' })).toBeVisible();
  });

  test('cURL snippet shows correct method and URL', async ({ page }) => {
    const section = endpointSection(page, 'echo json');
    const snippets = section.locator('.code-snippets-wrapper');

    await expect(snippets).toContainText('curl');
    await expect(snippets).toContainText('POST');
    await expect(snippets).toContainText('/api/echo/json');
  });

  test('each endpoint has its own code snippet section', async ({ page }) => {
    const putSnippets = endpointSection(page, 'update user').locator('.code-snippets-wrapper');
    await expect(putSnippets).toContainText('curl');

    const deleteSnippets = endpointSection(page, 'delete user').locator('.code-snippets-wrapper');
    await expect(deleteSnippets).toContainText('curl');
  });
});

test.describe.skip('Examples for new request types', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.examples-container');
  });

  test('PUT request examples show Success and Not Found tabs', async ({ page }) => {
    const examples = endpointSection(page, 'update user').locator('.examples-container');

    await expect(examples.locator('.example-tab', { hasText: 'Success' })).toBeVisible();
    await expect(examples.locator('.example-tab', { hasText: 'Not Found' })).toBeVisible();
  });

  test('PUT Not Found example shows 404 status', async ({ page }) => {
    const examples = endpointSection(page, 'update user').locator('.examples-container');

    await examples.locator('.example-tab', { hasText: 'Not Found' }).click();
    await expect(examples.locator('.status-badge')).toContainText('404');
    await expect(examples.locator('.status-badge.client-error')).toBeVisible();
  });

  test('DELETE examples show 204 No Content', async ({ page }) => {
    const examples = endpointSection(page, 'delete user').locator('.examples-container');

    await expect(examples.locator('.example-tab', { hasText: 'Deleted' })).toBeVisible();
    await expect(examples.locator('.status-badge')).toContainText('204');
  });

  test('DELETE Forbidden example shows 403 status', async ({ page }) => {
    const examples = endpointSection(page, 'delete user').locator('.examples-container');

    await examples.locator('.example-tab', { hasText: 'Forbidden' }).click();
    await expect(examples.locator('.status-badge')).toContainText('403');
    await expect(examples.locator('.status-badge.client-error')).toBeVisible();
  });

  test('XML example shows XML response body', async ({ page }) => {
    const examples = endpointSection(page, 'xml payload').locator('.examples-container');

    const responseSection = examples.locator('.content-section').nth(1);
    await expect(responseSection.locator('.body-content')).toContainText('GetUserInfoResponse');
    await expect(responseSection.locator('.body-content')).toContainText('Alice');
  });

  test('search users example shows request params tab', async ({ page }) => {
    const examples = endpointSection(page, 'search users').locator('.examples-container');

    const requestSection = examples.locator('.content-section').first();
    await requestSection.locator('.toggle-btn', { hasText: 'Params' }).click();

    const paramsTable = requestSection.locator('.headers-table');
    await expect(paramsTable).toBeVisible();
    await expect(paramsTable).toContainText('q');
    await expect(paramsTable).toContainText('alice');
  });
});

