import { test, expect } from '../../playwright';

test.describe('Playground request tabs — responsive overflow', () => {
  test.use({ viewport: { width: 900, height: 800 } });

  test('collapses overflowing tabs into a ⋯ dropdown and selects from it', async ({ page, playground }) => {
    await playground.open('bottom');
    await playground.openRequest('get users');

    await expect(page.getByTestId('tabs-more')).toBeVisible();

    await playground.selectTab('tests');
    await expect(page.getByTestId('tabs-tab-tests')).toHaveAttribute('aria-selected', 'true');
  });
});
