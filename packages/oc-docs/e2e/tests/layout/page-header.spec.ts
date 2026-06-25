import { test, expect } from '../../playwright';

/**
 * The page header (sticky top navigation bar): brand cluster + Open-in-Bruno
 * CTA. These tests cover what the mounted app actually renders — the search and
 * env-switcher slots ship empty here, so they aren't exercised in this suite.
 */
test.use({ colorScheme: 'light' });

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 800 };

test.describe('Page header', () => {
  test('shows brand (name + version) and a pinned bar', async ({ page, pageHeader }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');

    await expect(pageHeader.root).toBeVisible();
    await expect(pageHeader.brandName).toContainText('Bruno Testbench');
    await expect(pageHeader.brandVersion).toHaveText('v1.0.0');

    // Sticky: header stays at the top after the page scrolls.
    await page.mouse.wheel(0, 600);
    const box = await pageHeader.root.boundingBox();
    if (!box) throw new Error('header has no bounding box');
    expect(box.y).toBeLessThanOrEqual(1);
  });

  test('shows the initials avatar derived from the collection name', async ({ page, pageHeader }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');

    // sampleCollection name is "Bruno Testbench" → "BT".
    await expect(pageHeader.brandInitials).toBeVisible();
    await expect(pageHeader.brandInitials).toHaveText('BT');
  });

  test('Open-in-Bruno CTA deep-links via bruno:// and is pinned right', async ({ page, pageHeader }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');

    await expect(pageHeader.openInBruno).toBeVisible();
    const href = await pageHeader.openInBruno.getAttribute('href');
    expect(href).toMatch(/^bruno:\/\/app\/collection\/import\/git\?url=/);

    // CTA hugs the right edge (within the 20px bar padding), not the brand.
    const headerBox = await pageHeader.root.boundingBox();
    const ctaBox = await pageHeader.openInBruno.boundingBox();
    const brandBox = await pageHeader.brand.boundingBox();
    expect((headerBox!.x + headerBox!.width) - (ctaBox!.x + ctaBox!.width)).toBeLessThanOrEqual(24);
    expect(ctaBox!.x).toBeGreaterThan(brandBox!.x + brandBox!.width + 100);
  });

  test('mobile condenses: hamburger shows, CTA hidden, brand compact', async ({ page, pageHeader }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/');

    // Below desktop the sidebar trigger appears.
    await expect(pageHeader.menuButton).toBeVisible();
    // Open-in-Bruno is desktop-only (no Bruno desktop app on mobile).
    await expect(pageHeader.openInBruno).toHaveCount(0);

    // Compact brand: avatar + "Docs" only — no full name, no version.
    await expect(pageHeader.brandName).toHaveText('Docs');
    await expect(pageHeader.brandVersion).toHaveCount(0);
    await expect(pageHeader.root).not.toContainText('Bruno Testbench');

    // No horizontal overflow.
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollW).toBeLessThanOrEqual(MOBILE.width + 1);
  });
});
