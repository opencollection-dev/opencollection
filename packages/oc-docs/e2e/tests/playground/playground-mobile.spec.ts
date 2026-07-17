import { test, expect } from '../../playwright';

// A phone user agent flips useIsMobilePhone to true (it reads navigator.userAgent,
// not the viewport). The viewport is set to a phone size for realism.
const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

test.describe('playground on a phone', () => {
  test.use({ userAgent: IPHONE_UA, viewport: { width: 390, height: 844 } });

  test('opens fullscreen with no dock switcher or collapse', async ({ page, playground }) => {
    // The dock param is ignored on a phone; MobileDock renders instead.
    await page.goto('/#/?pg=1&dock=bottom');
    await expect(playground.mobilePanel).toBeVisible();
    await expect(playground.runner).toBeVisible();
    await expect(playground.switcher).toHaveCount(0);
    await expect(playground.collapseButton).toHaveCount(0);
    await expect(playground.sidebarToggle).toBeVisible();
    await expect(playground.closeButton).toBeVisible();
    // The desktop dock shells never mount on a phone.
    await expect(playground.bottomPanel).toHaveCount(0);
  });

  test('sidebar is an overlay: starts closed, opens on toggle, closes on navigate', async ({ page, playground }) => {
    await page.goto('/#/?pg=1&dock=bottom');
    await expect(playground.mobilePanel).toBeVisible();
    await expect(playground.sidebarPanel).toHaveCount(0);

    await playground.sidebarToggle.click();
    await expect(playground.sidebarPanel).toBeVisible();

    // Opening the environments view is a navigate; the overlay sidebar closes.
    await playground.gear.click();
    await expect(playground.sidebarPanel).toHaveCount(0);
  });

  test('closes from the header and clears the url state', async ({ page, playground }) => {
    await page.goto('/#/?pg=1&dock=bottom');
    await expect(playground.mobilePanel).toBeVisible();

    await playground.close();
    await expect(playground.header).toHaveCount(0);
    await expect(page).toHaveURL(/#\/$/);
  });
});
