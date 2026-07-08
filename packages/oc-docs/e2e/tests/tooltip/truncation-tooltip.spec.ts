import { test, expect } from '../../playwright';

const GET_ALL_CUSTOMERS = ['billing', 'customers', 'Get All Customers'];

test.describe('Truncation tooltips', () => {
  test('reveals the full text in a tooltip when a value is truncated (narrow viewport)', async ({
    requestPage,
    tooltip,
    page
  }) => {
    await requestPage.open(GET_ALL_CUSTOMERS);
    await page.setViewportSize({ width: 280, height: 800 });

    const clippedCell = await tooltip.findFirstClippedCell();
    expect(clippedCell, 'expected at least one truncated cell at 280px').not.toBeNull();

    await tooltip.hoverCell(clippedCell!.index);
    await expect(tooltip.popup).toBeVisible();
    await expect(tooltip.popup).toHaveText(clippedCell!.fullText);
  });

  test('does not attach a tooltip to text that fits (wide viewport)', async ({ requestPage, tooltip, page }) => {
    await requestPage.open(GET_ALL_CUSTOMERS);
    await page.setViewportSize({ width: 1400, height: 900 });

    const unclippedCellIndex = await tooltip.findFirstUnclippedCellIndex();
    test.skip(unclippedCellIndex < 0, 'no non-truncated text found to check');

    await tooltip.hoverCell(unclippedCellIndex);
    await expect(tooltip.popup).toHaveCount(0);
  });
});
