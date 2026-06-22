import { test, expect } from '@fixtures';

test.describe('HTTP method badges and URLs', () => {
  test.beforeEach(async ({ collectionPage }) => {
    await collectionPage.goto();
  });

  test('POST request shows method badge', async ({ collectionPage }) => {
    await expect(collectionPage.endpoint('echo json').methodBadge).toContainText('POST');
  });

  test('GET request shows method badge', async ({ collectionPage }) => {
    await expect(collectionPage.endpoint('get users').methodBadge).toContainText('GET');
  });

  test('PUT request renders with method and URL', async ({ collectionPage }) => {
    const section = collectionPage.endpoint('update user');
    await expect(section.methodBadge).toContainText('PUT');
    await expect(section.url).toContainText('/api/users/1');
  });

  test('PATCH request renders with method badge', async ({ collectionPage }) => {
    await expect(collectionPage.endpoint('patch user').methodBadge).toContainText('PATCH');
  });

  test('DELETE request renders with method badge', async ({ collectionPage }) => {
    await expect(collectionPage.endpoint('delete user').methodBadge).toContainText('DELETE');
  });

  test('URL displays with variable placeholders', async ({ collectionPage }) => {
    await expect(collectionPage.endpoint('echo json').url).toContainText('{{host}}/api/echo/json');
  });
});

test.describe('Request headers table', () => {
  test.beforeEach(async ({ collectionPage }) => {
    await collectionPage.goto();
  });

  test('renders headers with name and value columns', async ({ collectionPage }) => {
    const { headersTable } = collectionPage.endpoint('echo json');
    await expect(headersTable.locator('th', { hasText: 'Name' })).toBeVisible();
    await expect(headersTable.locator('th', { hasText: 'Value' })).toBeVisible();
    await expect(headersTable.getByRole('cell', { name: 'Content-Type', exact: true })).toBeVisible();
    await expect(headersTable.getByRole('cell', { name: 'application/json', exact: true })).toBeVisible();
  });

  test('disabled headers still render in the table', async ({ collectionPage }) => {
    const { headersTable } = collectionPage.endpoint('update user');
    const disabledRow = headersTable.locator('tr').filter({ hasText: 'X-Deprecated-Header' });
    await expect(disabledRow).toBeVisible();
    await expect(disabledRow.getByRole('cell', { name: 'old-value', exact: true })).toBeVisible();
  });

  test('multiple headers render in separate rows', async ({ collectionPage }) => {
    const { headersTable } = collectionPage.endpoint('update user');
    await expect(headersTable.getByRole('cell', { name: 'Content-Type', exact: true })).toBeVisible();
    await expect(headersTable.getByRole('cell', { name: 'Authorization', exact: true })).toBeVisible();
    await expect(headersTable.getByRole('cell', { name: 'X-Deprecated-Header', exact: true })).toBeVisible();
  });
});

test.describe('Request body rendering', () => {
  test.beforeEach(async ({ collectionPage }) => {
    await collectionPage.goto();
  });

  test('JSON body renders in code view', async ({ collectionPage }) => {
    const section = collectionPage.endpoint('echo json');
    await expect(section.requestBodyTitle).toContainText('Body');
    await expect(section.requestBody).toContainText('request-level-variable');
  });

  test('form-urlencoded body renders as key=value pairs', async ({ collectionPage }) => {
    const { requestBody } = collectionPage.endpoint('submit form');
    await expect(requestBody).toBeVisible();
    await expect(requestBody).toContainText('name=Alice');
    await expect(requestBody).toContainText('email=alice%40example.com');
    await expect(requestBody).toContainText('message=Hello');
    // "debug=true" is disabled, should be filtered out.
    await expect(requestBody).not.toContainText('debug');
  });

  test('multipart-form body renders as name: value pairs', async ({ collectionPage }) => {
    const { requestBody } = collectionPage.endpoint('upload file');
    await expect(requestBody).toBeVisible();
    await expect(requestBody).toContainText('file: /path/to/document.pdf');
    await expect(requestBody).toContainText('description: Quarterly report');
    await expect(requestBody).toContainText('tags: report,quarterly');
  });

  test('XML body renders in code view', async ({ collectionPage }) => {
    const { requestBody } = collectionPage.endpoint('xml payload');
    await expect(requestBody).toBeVisible();
    await expect(requestBody).toContainText('soap:Envelope');
    await expect(requestBody).toContainText('GetUserInfo');
  });

  test('PUT request with JSON body renders correctly', async ({ collectionPage }) => {
    const { requestBody } = collectionPage.endpoint('update user');
    await expect(requestBody).toBeVisible();
    await expect(requestBody).toContainText('Jane Doe');
    await expect(requestBody).toContainText('jane@example.com');
  });

  test('PATCH request with partial JSON body renders', async ({ collectionPage }) => {
    const { requestBody } = collectionPage.endpoint('patch user');
    await expect(requestBody).toBeVisible();
    await expect(requestBody).toContainText('moderator');
  });

  test('GET request without body does not show body section', async ({ collectionPage }) => {
    await expect(collectionPage.endpoint('get users').requestBody).not.toBeVisible();
  });

  test('DELETE request without body does not show body section', async ({ collectionPage }) => {
    await expect(collectionPage.endpoint('delete user').requestBody).not.toBeVisible();
  });
});

test.describe('Query parameters table', () => {
  test.beforeEach(async ({ collectionPage }) => {
    await collectionPage.goto();
  });

  test('renders query parameters with name and value', async ({ collectionPage }) => {
    const { queryParamsTable } = collectionPage.endpoint('search users');
    await expect(queryParamsTable).toBeVisible();
    await expect(queryParamsTable.getByRole('cell', { name: 'q', exact: true })).toBeVisible();
    await expect(queryParamsTable.getByRole('cell', { name: 'alice', exact: true })).toBeVisible();
    await expect(queryParamsTable.getByRole('cell', { name: 'role', exact: true })).toBeVisible();
    await expect(queryParamsTable.getByRole('cell', { name: 'admin', exact: true })).toBeVisible();
    await expect(queryParamsTable.getByRole('cell', { name: 'status', exact: true })).toBeVisible();
    await expect(queryParamsTable.getByRole('cell', { name: 'active', exact: true })).toBeVisible();
  });

  test('disabled query params still render in the table', async ({ collectionPage }) => {
    const { queryParamsTable } = collectionPage.endpoint('search users');
    const row = queryParamsTable.locator('tr').filter({ hasText: 'verbose' });
    await expect(row).toBeVisible();
    await expect(row.getByRole('cell', { name: 'true', exact: true })).toBeVisible();
  });

  test('endpoint without explicit params does not show params table', async ({ collectionPage }) => {
    await expect(collectionPage.endpoint('echo json').queryParamsTable).not.toBeVisible();
  });
});

test.describe('Request documentation', () => {
  test.beforeEach(async ({ collectionPage }) => {
    await collectionPage.goto();
  });

  test('renders item-level docs as markdown', async ({ collectionPage }) => {
    const { itemDocs } = collectionPage.endpoint('get users');
    await expect(itemDocs).toBeVisible();
    await expect(itemDocs).toContainText('Retrieve a paginated list of users');
  });

  test('PUT request shows its description', async ({ collectionPage }) => {
    await expect(collectionPage.endpoint('update user').itemDocs).toContainText('Replace an existing user entirely');
  });

  test('PATCH request shows its description', async ({ collectionPage }) => {
    await expect(collectionPage.endpoint('patch user').itemDocs).toContainText('Partially update a user');
  });

  test('DELETE request shows its description', async ({ collectionPage }) => {
    await expect(collectionPage.endpoint('delete user').itemDocs).toContainText('Permanently delete a user');
  });

  test('form endpoint shows its description', async ({ collectionPage }) => {
    await expect(collectionPage.endpoint('submit form').itemDocs).toContainText('Submit a contact form');
  });

  test('endpoint without docs does not show docs section', async ({ collectionPage }) => {
    await expect(collectionPage.endpoint('echo json').itemDocs).not.toBeVisible();
  });
});

test.describe('Code snippets', () => {
  test.beforeEach(async ({ collectionPage }) => {
    await collectionPage.goto();
  });

  test('renders code snippet section with language tabs', async ({ collectionPage }) => {
    const { codeSnippets } = collectionPage.endpoint('echo json');
    await expect(codeSnippets.locator('button', { hasText: 'cURL' })).toBeVisible();
    await expect(codeSnippets.locator('button', { hasText: 'JavaScript' })).toBeVisible();
    await expect(codeSnippets.locator('button', { hasText: 'Python' })).toBeVisible();
  });

  test('cURL snippet shows correct method and URL', async ({ collectionPage }) => {
    const { codeSnippets } = collectionPage.endpoint('echo json');
    await expect(codeSnippets).toContainText('curl');
    await expect(codeSnippets).toContainText('POST');
    await expect(codeSnippets).toContainText('/api/echo/json');
  });

  test('each endpoint has its own code snippet section', async ({ collectionPage }) => {
    await expect(collectionPage.endpoint('update user').codeSnippets).toContainText('curl');
    await expect(collectionPage.endpoint('delete user').codeSnippets).toContainText('curl');
  });
});

test.describe('Examples for new request types', () => {
  test.beforeEach(async ({ collectionPage }) => {
    await collectionPage.goto();
  });

  test('PUT request examples show Success and Not Found tabs', async ({ collectionPage }) => {
    const { examples } = collectionPage.endpoint('update user');
    await expect(examples.tab('Success')).toBeVisible();
    await expect(examples.tab('Not Found')).toBeVisible();
  });

  test('PUT Not Found example shows 404 status', async ({ collectionPage }) => {
    const { examples } = collectionPage.endpoint('update user');
    await examples.selectExample('Not Found');
    await expect(examples.statusBadge).toContainText('404');
    await expect(examples.statusBadgeByTone('client-error')).toBeVisible();
  });

  test('DELETE examples show 204 No Content', async ({ collectionPage }) => {
    const { examples } = collectionPage.endpoint('delete user');
    await expect(examples.tab('Deleted')).toBeVisible();
    await expect(examples.statusBadge).toContainText('204');
  });

  test('DELETE Forbidden example shows 403 status', async ({ collectionPage }) => {
    const { examples } = collectionPage.endpoint('delete user');
    await examples.selectExample('Forbidden');
    await expect(examples.statusBadge).toContainText('403');
    await expect(examples.statusBadgeByTone('client-error')).toBeVisible();
  });

  test('XML example shows XML response body', async ({ collectionPage }) => {
    const { response } = collectionPage.endpoint('xml payload').examples;
    await expect(response.bodyContent).toContainText('GetUserInfoResponse');
    await expect(response.bodyContent).toContainText('Alice');
  });

  test('search users example shows request params tab', async ({ collectionPage }) => {
    const { request } = collectionPage.endpoint('search users').examples;
    await request.show('Params');
    await expect(request.headersTable).toBeVisible();
    await expect(request.headersTable).toContainText('q');
    await expect(request.headersTable).toContainText('alice');
  });
});
