import { test, expect } from '../../playwright';

const GET_ALL_CUSTOMERS = ['billing', 'customers', 'Get All Customers'];
const OK_EXAMPLE = '200 OK - first page';
const BAD_REQUEST_EXAMPLE = '400 Bad Request - invalid per_page';

test.describe('Sidebar - Examples (docs)', () => {
  test.beforeEach(async ({ requestPage }) => {
    await requestPage.open(GET_ALL_CUSTOMERS);
  });

  test('keeps a request with examples collapsed until its toggle is expanded', async ({ sidebar }) => {
    await expect(sidebar.exampleToggle('Get All Customers')).toBeVisible();
    await expect(sidebar.exampleRow(OK_EXAMPLE)).toHaveCount(0);

    await sidebar.toggleExamples('Get All Customers');
    await expect(sidebar.exampleRow(OK_EXAMPLE)).toBeVisible();
    await expect(sidebar.exampleRow(BAD_REQUEST_EXAMPLE)).toBeVisible();
  });

  test('clicking an example navigates to the parent request page and highlights the matching example card', async ({
    sidebar,
    requestPage,
    page
  }) => {
    await sidebar.toggleExamples('Get All Customers');
    await sidebar.exampleRow(OK_EXAMPLE).click();

    await expect(page.getByTestId('page')).toHaveAttribute('data-page-type', 'request');
    await expect(page).toHaveURL(/#\/billing\/customers\/get-all-customers$/);

    const activeCard = requestPage.examples.activeCard;
    await expect(activeCard).toBeVisible();
    await expect(activeCard).toContainText(OK_EXAMPLE);
    await expect(sidebar.exampleRow(OK_EXAMPLE)).toHaveClass(/active/);
    // Only the example row is active, not its parent request row.
    await expect(sidebar.item('Get All Customers')).not.toHaveClass(/active/);
  });

  test('switching to a different example moves the highlight to it', async ({ sidebar, requestPage }) => {
    await sidebar.toggleExamples('Get All Customers');
    await sidebar.exampleRow(OK_EXAMPLE).click();
    await expect(requestPage.examples.activeCard).toContainText(OK_EXAMPLE);

    await sidebar.exampleRow(BAD_REQUEST_EXAMPLE).click();

    const activeCard = requestPage.examples.activeCard;
    await expect(activeCard).toContainText(BAD_REQUEST_EXAMPLE);
    await expect(activeCard).not.toContainText(OK_EXAMPLE);
    await expect(sidebar.exampleRow(BAD_REQUEST_EXAMPLE)).toHaveClass(/active/);
  });
});
