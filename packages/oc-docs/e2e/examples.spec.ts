import { test, expect } from '@playwright/test';

// Skipped: the BRU-2571 Overview revamp renders only the Overview at `/` and
// disabled the all-endpoints view in Docs.tsx, so `.examples-container` and the
// per-endpoint example tabs no longer exist on the page. Re-enable these specs
// (drop the `.skip`) once the endpoints view is restored or relocated.

test.describe.skip('Request/response examples', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.examples-container');
  });

  test('examples display below code snippets', async ({ page }) => {
    // "echo json" endpoint: code snippets should appear before examples
    const echoSection = page.locator('.endpoint-section').filter({ hasText: 'echo json' });
    const codeSnippets = echoSection.locator('.code-snippets-wrapper');
    const examples = echoSection.locator('.examples-container');

    await expect(codeSnippets).toBeVisible();
    await expect(examples).toBeVisible();

    const snippetsBox = await codeSnippets.boundingBox();
    const examplesBox = await examples.boundingBox();
    expect(snippetsBox!.y).toBeLessThan(examplesBox!.y);
  });

  test('example shows request body', async ({ page }) => {
    const echoExamples = page.locator('.examples-container').first();
    // "Create User" is the default active example
    const requestSection = echoExamples.locator('.content-section').first();
    await expect(requestSection.locator('.content-label', { hasText: 'Request' })).toBeVisible();
    await expect(requestSection.locator('.body-content')).toContainText('John Doe');
  });

  test('example shows response body', async ({ page }) => {
    const echoExamples = page.locator('.examples-container').first();
    const responseSection = echoExamples.locator('.content-section').nth(1);
    await expect(responseSection.locator('.content-label', { hasText: 'Response' })).toBeVisible();
    await expect(responseSection.locator('.body-content')).toContainText('John Doe');
  });

  test('example response shows status code', async ({ page }) => {
    const echoExamples = page.locator('.examples-container').first();
    const statusBadge = echoExamples.locator('.status-badge');
    await expect(statusBadge).toBeVisible();
    await expect(statusBadge).toContainText('201');
  });

  test('status badge has correct styling for success codes', async ({ page }) => {
    const echoExamples = page.locator('.examples-container').first();
    // "Create User" has status 201 → success class
    await expect(echoExamples.locator('.status-badge.success')).toBeVisible();
  });

  test('example shows method and URL', async ({ page }) => {
    const echoExamples = page.locator('.examples-container').first();
    const urlRow = echoExamples.locator('.example-url-row');
    await expect(urlRow.locator('.example-method')).toContainText('POST');
    await expect(urlRow.locator('.example-url')).toContainText('/api/echo/json');
  });
});

test.describe.skip('Multiple examples per request (tabs)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.examples-container');
  });

  test('renders tabs for all examples', async ({ page }) => {
    const echoExamples = page.locator('.examples-container').first();
    const tabs = echoExamples.locator('.example-tab');
    await expect(tabs.getByText('Create User')).toBeVisible();
    await expect(tabs.getByText('Update User')).toBeVisible();
    await expect(tabs.getByText('Empty Response')).toBeVisible();
    await expect(tabs.getByText('Validation Error')).toBeVisible();
    await expect(tabs.getByText('Server Error')).toBeVisible();
  });

  test('first tab is active by default', async ({ page }) => {
    const echoExamples = page.locator('.examples-container').first();
    const firstTab = echoExamples.locator('.example-tab').first();
    await expect(firstTab).toHaveClass(/active/);
    await expect(firstTab).toContainText('Create User');
  });

  test('clicking a tab switches the active example', async ({ page }) => {
    const echoExamples = page.locator('.examples-container').first();

    // Switch to "Update User"
    await echoExamples.locator('.example-tab', { hasText: 'Update User' }).click();

    // Tab should become active
    await expect(echoExamples.locator('.example-tab', { hasText: 'Update User' })).toHaveClass(/active/);

    // Response should show status 200
    await expect(echoExamples.locator('.status-badge')).toContainText('200');

    // Body should show "Jane Doe"
    await expect(echoExamples.locator('.body-content').first()).toContainText('Jane Doe');
  });

  test('switching to error example shows client-error status', async ({ page }) => {
    const echoExamples = page.locator('.examples-container').first();
    await echoExamples.locator('.example-tab', { hasText: 'Validation Error' }).click();

    await expect(echoExamples.locator('.status-badge')).toContainText('400');
    await expect(echoExamples.locator('.status-badge.client-error')).toBeVisible();
  });

  test('switching to server error example shows server-error status', async ({ page }) => {
    const echoExamples = page.locator('.examples-container').first();
    await echoExamples.locator('.example-tab', { hasText: 'Server Error' }).click();

    await expect(echoExamples.locator('.status-badge')).toContainText('500');
    await expect(echoExamples.locator('.status-badge.server-error')).toBeVisible();
  });

  test('get users endpoint has its own example tabs', async ({ page }) => {
    const getUsersExamples = page.locator('.endpoint-section').filter({ hasText: 'get users' }).locator('.examples-container');
    await expect(getUsersExamples.locator('.example-tab', { hasText: 'List Users' })).toBeVisible();
    await expect(getUsersExamples.locator('.example-tab', { hasText: 'Unauthorized' })).toBeVisible();
  });
});

test.describe.skip('Body/Headers toggle within examples', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.examples-container');
  });

  test('request section has Body, Headers, and Params toggle buttons', async ({ page }) => {
    const echoExamples = page.locator('.examples-container').first();
    const requestSection = echoExamples.locator('.content-section').first();
    const toggleButtons = requestSection.locator('.toggle-btn');

    await expect(toggleButtons.getByText('Body')).toBeVisible();
    await expect(toggleButtons.getByText('Headers')).toBeVisible();
    await expect(toggleButtons.getByText('Params')).toBeVisible();
  });

  test('response section has Body and Headers toggle buttons', async ({ page }) => {
    const echoExamples = page.locator('.examples-container').first();
    const responseSection = echoExamples.locator('.content-section').nth(1);
    const toggleButtons = responseSection.locator('.toggle-btn');

    await expect(toggleButtons.getByText('Body')).toBeVisible();
    await expect(toggleButtons.getByText('Headers')).toBeVisible();
  });

  test('Body tab is active by default for request', async ({ page }) => {
    const echoExamples = page.locator('.examples-container').first();
    const requestSection = echoExamples.locator('.content-section').first();

    // Body toggle should be active
    await expect(requestSection.locator('.toggle-btn', { hasText: 'Body' })).toHaveClass(/active/);
    // Body content should be visible with request data
    await expect(requestSection.locator('.body-content')).toBeVisible();
  });

  test('switching to Headers tab shows request headers table', async ({ page }) => {
    const echoExamples = page.locator('.examples-container').first();
    const requestSection = echoExamples.locator('.content-section').first();

    await requestSection.locator('.toggle-btn', { hasText: 'Headers' }).click();

    await expect(requestSection.locator('.toggle-btn', { hasText: 'Headers' })).toHaveClass(/active/);
    const headersTable = requestSection.locator('.headers-table');
    await expect(headersTable).toBeVisible();
    await expect(headersTable.getByRole('cell', { name: 'Content-Type' })).toBeVisible();
    await expect(headersTable.getByRole('cell', { name: 'application/json' })).toBeVisible();
  });

  test('switching to Headers tab shows response headers table', async ({ page }) => {
    const echoExamples = page.locator('.examples-container').first();
    const responseSection = echoExamples.locator('.content-section').nth(1);

    await responseSection.locator('.toggle-btn', { hasText: 'Headers' }).click();

    await expect(responseSection.locator('.toggle-btn', { hasText: 'Headers' })).toHaveClass(/active/);
    const headersTable = responseSection.locator('.headers-table');
    await expect(headersTable).toBeVisible();
    await expect(headersTable.getByRole('cell', { name: 'Content-Type' })).toBeVisible();
    await expect(headersTable.getByRole('cell', { name: 'X-Request-ID' })).toBeVisible();
  });

  test('switching tabs resets to Body when changing examples', async ({ page }) => {
    const echoExamples = page.locator('.examples-container').first();
    const requestSection = echoExamples.locator('.content-section').first();

    // Switch to Headers tab
    await requestSection.locator('.toggle-btn', { hasText: 'Headers' }).click();
    await expect(requestSection.locator('.headers-table')).toBeVisible();

    // Switch to a different example
    await echoExamples.locator('.example-tab', { hasText: 'Update User' }).click();

    // Should reset back to Body tab
    await expect(requestSection.locator('.toggle-btn', { hasText: 'Body' })).toHaveClass(/active/);
    await expect(requestSection.locator('.body-content')).toBeVisible();
  });

  test('example without request body shows "No request body" message', async ({ page }) => {
    const echoExamples = page.locator('.examples-container').first();

    // "Empty Response" has no request
    await echoExamples.locator('.example-tab', { hasText: 'Empty Response' }).click();
    const requestSection = echoExamples.locator('.content-section').first();
    await expect(requestSection).toContainText(/no request/i);
  });
});
