import { test, expect } from '../../playwright';

const FILTER_BY_DATE_RANGE = ['billing', 'customers', 'Get Customers - Filter by Date Range'];

test.describe('Request page — Details', () => {
  test.beforeEach(async ({ requestPage }) => {
    await requestPage.open(FILTER_BY_DATE_RANGE);
  });

  test.describe('Breadcrumb', () => {
    test('shows the folder trail to the request', async ({ requestPage }) => {
      const { breadcrumb } = requestPage;
      await expect(breadcrumb.segment('billing')).toBeVisible();
      await expect(breadcrumb.segment('customers')).toBeVisible();
      await expect(breadcrumb.current).toHaveText('Get Customers - Filter by Date Range');
    });

    test('returns to a parent folder when its segment is clicked', async ({ requestPage, page }) => {
      await requestPage.breadcrumb.segment('customers').click();
      await expect(page.getByTestId('overview')).toBeVisible();
    });
  });

  test('shows the request name as the page title', async ({ requestPage }) => {
    await expect(requestPage.title).toHaveText('Get Customers - Filter by Date Range');
  });

  test('shows the GET method and the request URL', async ({ requestPage }) => {
    await expect(requestPage.urlBar.method).toHaveText('GET');
    await expect(requestPage.urlBar.url).toContainText('{{baseUrl}}/billing/customers');
  });

  test('offers a "Try" action to open the request in the playground', async ({ requestPage }) => {
    await expect(requestPage.urlBar.tryButton).toBeVisible();
  });

  test('renders the request description', async ({ requestPage }) => {
    await expect(requestPage.description).toContainText('Retrieves customers created within a date range.');
  });

  test.describe('Params section', () => {
    test('lists the query parameters', async ({ requestPage }) => {
      const params = requestPage.section('Params');
      await expect(params).toBeVisible();
      await expect(params.getByText('created[gte]')).toBeVisible();
      await expect(params.getByText('created[lte]')).toBeVisible();
      await expect(params.getByText('per_page')).toBeVisible();
    });

    test('shows each parameter value', async ({ requestPage }) => {
      const params = requestPage.section('Params');
      await expect(params.getByText('2024-01-01')).toBeVisible();
      await expect(params.getByText('2024-12-31')).toBeVisible();
    });
  });

  test.describe('Auth section', () => {
    test('shows the auth mode inherited from the collection', async ({ requestPage }) => {
      const auth = requestPage.section('Auth');
      await expect(auth).toBeVisible();
      await expect(auth.getByText('Inherited from collection')).toBeVisible();
      await expect(auth.getByText('Bearer Token')).toBeVisible();
    });
  });

  test.describe('Code snippet', () => {
    test('shows a cURL command by default', async ({ requestPage }) => {
      const { codeSnippet } = requestPage;
      await expect(codeSnippet.languageTab('curl')).toHaveAttribute('aria-selected', 'true');
      await expect(codeSnippet.code).toContainText('curl');
      await expect(codeSnippet.code).toContainText('/billing/customers');
    });

    test('switches to the Python snippet when its tab is selected', async ({ requestPage }) => {
      const { codeSnippet } = requestPage;
      await codeSnippet.selectLanguage('python');
      await expect(codeSnippet.languageTab('python')).toHaveAttribute('aria-selected', 'true');
      await expect(codeSnippet.code).toContainText('requests');
    });
  });
});
