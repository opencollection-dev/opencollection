import { test, expect } from '../../playwright';

const GET_ALL_CUSTOMERS = ['billing', 'customers', 'Get All Customers'];

test.describe('Request page — Examples', () => {
  test.beforeEach(async ({ requestPage }) => {
    await requestPage.open(GET_ALL_CUSTOMERS);
  });

  test('lists every saved example', async ({ requestPage }) => {
    const { examples } = requestPage;
    await expect(examples.root).toBeVisible();
    await expect(examples.cards).toHaveCount(2);
    await expect(examples.card('200 OK - first page')).toBeVisible();
    await expect(examples.card('400 Bad Request - invalid per_page')).toBeVisible();
  });

  test('shows the status code of each example', async ({ requestPage }) => {
    const { examples } = requestPage;
    await expect(examples.status('200 OK - first page')).toHaveText('200');
    await expect(examples.status('400 Bad Request - invalid per_page')).toHaveText('400');
  });
});
