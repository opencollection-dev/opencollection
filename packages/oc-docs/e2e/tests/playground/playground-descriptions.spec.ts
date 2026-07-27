import { test, expect } from '../../playwright';

// A request whose params, headers, variables and form body all carry authored descriptions.
const DESCRIBED = '/?fixture=descriptions#/?pg=1&dock=bottom';

test.describe('Playground — field descriptions', () => {
  test.beforeEach(async ({ page, playground }) => {
    await page.goto(DESCRIBED);
    await playground.openRequest('Described Request');
  });

  test('query params show a Description column with the authored text', async ({ playground }) => {
    await playground.selectTab('params');
    await expect(playground.keyValueTable.descriptionHeader).toBeVisible();
    await expect(playground.keyValueTable.descriptionInputs.first()).toHaveValue(
      'Filter orders by their fulfilment status'
    );
  });

  test('headers show descriptions, normalizing the legacy {content} object form to text', async ({ playground }) => {
    await playground.selectTab('headers');
    const descriptions = playground.keyValueTable.descriptionInputs;
    await expect(descriptions.nth(0)).toHaveValue('Bearer access token for the API');
    await expect(descriptions.nth(1)).toHaveValue('Correlation id echoed back on the response');
  });

  test('pre-request variables show the authored description', async ({ playground }) => {
    await playground.selectTab('variables');
    await expect(playground.preRequestVars.descriptionInputs.first()).toHaveValue('The order identifier under test');
  });

  test('form-urlencoded body fields show the authored description', async ({ playground }) => {
    await playground.selectTab('body');
    await expect(playground.keyValueTable.descriptionInputs.first()).toHaveValue('The OAuth2 grant type to use');
  });

  test('a description is editable and the edit persists across a tab switch', async ({ playground }) => {
    await playground.selectTab('params');
    const description = playground.keyValueTable.descriptionInputs.first();
    await description.fill('Only open, unfulfilled orders');
    await expect(description).toHaveValue('Only open, unfulfilled orders');

    // Leaving the tab unmounts the table; returning re-reads from the edited request state.
    await playground.selectTab('headers');
    await playground.selectTab('params');
    await expect(playground.keyValueTable.descriptionInputs.first()).toHaveValue('Only open, unfulfilled orders');
  });
});
