import { test, expect } from '@fixtures';

test.describe('Request/response examples', () => {
  test.beforeEach(async ({ collectionPage }) => {
    await collectionPage.goto();
  });

  test('examples display below code snippets', async ({ collectionPage }) => {
    const echo = collectionPage.endpoint('echo json');
    await expect(echo.codeSnippets).toBeVisible();
    await expect(echo.examples.root).toBeVisible();

    const snippetsBox = await echo.codeSnippets.boundingBox();
    const examplesBox = await echo.examples.root.boundingBox();
    expect(snippetsBox!.y).toBeLessThan(examplesBox!.y);
  });

  test('example shows request body', async ({ collectionPage }) => {
    const { request } = collectionPage.endpoint('echo json').examples;
    await expect(request.label).toContainText('Request');
    await expect(request.bodyContent).toContainText('John Doe');
  });

  test('example shows response body', async ({ collectionPage }) => {
    const { response } = collectionPage.endpoint('echo json').examples;
    await expect(response.label).toContainText('Response');
    await expect(response.bodyContent).toContainText('John Doe');
  });

  test('example response shows status code', async ({ collectionPage }) => {
    const examples = collectionPage.endpoint('echo json').examples;
    await expect(examples.statusBadge).toBeVisible();
    await expect(examples.statusBadge).toContainText('201');
  });

  test('status badge has correct styling for success codes', async ({ collectionPage }) => {
    // "Create User" has status 201 → success class.
    const examples = collectionPage.endpoint('echo json').examples;
    await expect(examples.statusBadgeByTone('success')).toBeVisible();
  });

  test('example shows method and URL', async ({ collectionPage }) => {
    const examples = collectionPage.endpoint('echo json').examples;
    await expect(examples.method).toContainText('POST');
    await expect(examples.url).toContainText('/api/echo/json');
  });
});

test.describe('Multiple examples per request (tabs)', () => {
  test.beforeEach(async ({ collectionPage }) => {
    await collectionPage.goto();
  });

  test('renders tabs for all examples', async ({ collectionPage }) => {
    const { tabs } = collectionPage.endpoint('echo json').examples;
    await expect(tabs.getByText('Create User')).toBeVisible();
    await expect(tabs.getByText('Update User')).toBeVisible();
    await expect(tabs.getByText('Empty Response')).toBeVisible();
    await expect(tabs.getByText('Validation Error')).toBeVisible();
    await expect(tabs.getByText('Server Error')).toBeVisible();
  });

  test('first tab is active by default', async ({ collectionPage }) => {
    const firstTab = collectionPage.endpoint('echo json').examples.tabs.first();
    await expect(firstTab).toHaveClass(/active/);
    await expect(firstTab).toContainText('Create User');
  });

  test('clicking a tab switches the active example', async ({ collectionPage }) => {
    const examples = collectionPage.endpoint('echo json').examples;

    await examples.selectExample('Update User');

    await expect(examples.tab('Update User')).toHaveClass(/active/);
    await expect(examples.statusBadge).toContainText('200');
    await expect(examples.request.bodyContent).toContainText('Jane Doe');
  });

  test('switching to error example shows client-error status', async ({ collectionPage }) => {
    const examples = collectionPage.endpoint('echo json').examples;
    await examples.selectExample('Validation Error');

    await expect(examples.statusBadge).toContainText('400');
    await expect(examples.statusBadgeByTone('client-error')).toBeVisible();
  });

  test('switching to server error example shows server-error status', async ({ collectionPage }) => {
    const examples = collectionPage.endpoint('echo json').examples;
    await examples.selectExample('Server Error');

    await expect(examples.statusBadge).toContainText('500');
    await expect(examples.statusBadgeByTone('server-error')).toBeVisible();
  });

  test('get users endpoint has its own example tabs', async ({ collectionPage }) => {
    const examples = collectionPage.endpoint('get users').examples;
    await expect(examples.tab('List Users')).toBeVisible();
    await expect(examples.tab('Unauthorized')).toBeVisible();
  });
});

test.describe('Body/Headers toggle within examples', () => {
  test.beforeEach(async ({ collectionPage }) => {
    await collectionPage.goto();
  });

  test('request section has Body, Headers, and Params toggle buttons', async ({ collectionPage }) => {
    const { request } = collectionPage.endpoint('echo json').examples;
    await expect(request.toggle('Body')).toBeVisible();
    await expect(request.toggle('Headers')).toBeVisible();
    await expect(request.toggle('Params')).toBeVisible();
  });

  test('response section has Body and Headers toggle buttons', async ({ collectionPage }) => {
    const { response } = collectionPage.endpoint('echo json').examples;
    await expect(response.toggle('Body')).toBeVisible();
    await expect(response.toggle('Headers')).toBeVisible();
  });

  test('Body tab is active by default for request', async ({ collectionPage }) => {
    const { request } = collectionPage.endpoint('echo json').examples;
    await expect(request.toggle('Body')).toHaveClass(/active/);
    await expect(request.bodyContent).toBeVisible();
  });

  test('switching to Headers tab shows request headers table', async ({ collectionPage }) => {
    const { request } = collectionPage.endpoint('echo json').examples;
    await request.show('Headers');

    await expect(request.toggle('Headers')).toHaveClass(/active/);
    await expect(request.headersTable).toBeVisible();
    await expect(request.headersTable.getByRole('cell', { name: 'Content-Type' })).toBeVisible();
    await expect(request.headersTable.getByRole('cell', { name: 'application/json' })).toBeVisible();
  });

  test('switching to Headers tab shows response headers table', async ({ collectionPage }) => {
    const { response } = collectionPage.endpoint('echo json').examples;
    await response.show('Headers');

    await expect(response.toggle('Headers')).toHaveClass(/active/);
    await expect(response.headersTable).toBeVisible();
    await expect(response.headersTable.getByRole('cell', { name: 'Content-Type' })).toBeVisible();
    await expect(response.headersTable.getByRole('cell', { name: 'X-Request-ID' })).toBeVisible();
  });

  test('switching tabs resets to Body when changing examples', async ({ collectionPage }) => {
    const examples = collectionPage.endpoint('echo json').examples;
    const { request } = examples;

    await request.show('Headers');
    await expect(request.headersTable).toBeVisible();

    await examples.selectExample('Update User');

    await expect(request.toggle('Body')).toHaveClass(/active/);
    await expect(request.bodyContent).toBeVisible();
  });

  test('example without request body shows "No request body" message', async ({ collectionPage }) => {
    const examples = collectionPage.endpoint('echo json').examples;

    // "Empty Response" has no request.
    await examples.selectExample('Empty Response');
    await expect(examples.request.root).toContainText(/no request/i);
  });
});
