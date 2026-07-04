import { test, expect } from '../../playwright';

const GET_ALL_CUSTOMERS = ['billing', 'customers', 'Get All Customers'];
const OK_EXAMPLE = '200 OK - first page';
const BAD_REQUEST_EXAMPLE = '400 Bad Request - invalid per_page';

test.describe('Request page — Examples', () => {
  test.beforeEach(async ({ requestPage }) => {
    await requestPage.open(GET_ALL_CUSTOMERS);
  });

  test('lists every saved example', async ({ requestPage }) => {
    const { examples } = requestPage;
    await expect(examples.root).toBeVisible();
    await expect(examples.items).toHaveCount(2);
    await expect(examples.example(OK_EXAMPLE)).toBeVisible();
    await expect(examples.example(BAD_REQUEST_EXAMPLE)).toBeVisible();
  });

  test('shows the status code of each example', async ({ requestPage }) => {
    const { examples } = requestPage;
    await expect(examples.statusCode(OK_EXAMPLE)).toHaveText('200');
    await expect(examples.statusCode(BAD_REQUEST_EXAMPLE)).toHaveText('400');
  });

  test.describe('Request pane', () => {
    test('shows the query parameters by default', async ({ requestPage }) => {
      const { examples } = requestPage;
      await expect(examples.requestBody(OK_EXAMPLE)).toContainText('per_page');
      await expect(examples.requestBody(OK_EXAMPLE)).toContainText('10');
    });

    test('switches to the Headers tab to reveal the request headers', async ({ requestPage }) => {
      const { examples } = requestPage;
      await examples.selectRequestTab(OK_EXAMPLE, 'headers');
      await expect(examples.requestBody(OK_EXAMPLE)).toContainText('Accept');
      await expect(examples.requestBody(OK_EXAMPLE)).toContainText('application/json');
    });
  });

  test.describe('Response pane', () => {
    test('shows the response body by default', async ({ requestPage }) => {
      const { examples } = requestPage;
      await expect(examples.responseBody(OK_EXAMPLE)).toContainText('cus_ABC123xyz');
      await expect(examples.responseBody(OK_EXAMPLE)).toContainText('john.smith@example.com');
    });

    test('switches to the Headers tab to reveal the response headers', async ({ requestPage }) => {
      const { examples } = requestPage;
      await examples.selectResponseTab(OK_EXAMPLE, 'headers');
      await expect(examples.responseBody(OK_EXAMPLE)).toContainText('x-total-count');
      await expect(examples.responseBody(OK_EXAMPLE)).toContainText('42');
    });
  });

  test('expands a collapsed example to reveal its response', async ({ requestPage }) => {
    const { examples } = requestPage;
    await examples.open(BAD_REQUEST_EXAMPLE);
    await expect(examples.responseBody(BAD_REQUEST_EXAMPLE)).toContainText('invalid_request');
  });
});
