import { test, expect } from '../../playwright';

const GET_ALL_CUSTOMERS = ['billing', 'customers', 'Get All Customers'];

test.describe('Truncation tooltips', () => {
  test('reveals the full text in a tooltip when a value is truncated (narrow viewport)', async ({ requestPage, page }) => {
    await requestPage.open(GET_ALL_CUSTOMERS);

    await page.setViewportSize({ width: 280, height: 800 });

    const found = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('.oc-truncate'));
      const index = els.findIndex((el) => el.scrollWidth > el.clientWidth + 1);
      return index >= 0 ? { index, text: (els[index].textContent || '').trim() } : null;
    });

    expect(found, 'expected at least one truncated .oc-truncate element at 280px').not.toBeNull();

    const anchor = page.locator('.oc-truncate').nth(found!.index);
    await anchor.hover();

    const tooltip = page.locator('.oc-tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveText(found!.text);
  });

  test('does not attach a tooltip to text that fits (wide viewport)', async ({ requestPage, page }) => {
    await requestPage.open(GET_ALL_CUSTOMERS);
    await page.setViewportSize({ width: 1400, height: 900 });

    const fits = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('.oc-truncate'));
      return els.findIndex((el) => el.scrollWidth <= el.clientWidth + 1);
    });
    test.skip(fits < 0, 'no non-truncated text found to check');

    await page.locator('.oc-truncate').nth(fits).hover();
    await expect(page.locator('.oc-tooltip')).toHaveCount(0);
  });
});
