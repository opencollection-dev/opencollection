import { test, expect } from '@playwright/test';

test.use({ colorScheme: 'light' });

const DESKTOP = { width: 1280, height: 900 };
const TABLET = { width: 820, height: 1024 };
const MOBILE = { width: 390, height: 800 };

test.describe('Topbar — mounted app', () => {
  test('shows brand (name + version) and a pinned bar', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');

    const header = page.getByTestId('topbar');
    await expect(header).toBeVisible();
    await expect(page.getByTestId('brand-name')).toContainText('Bruno Testbench');
    await expect(page.getByTestId('brand-version')).toHaveText('v1.0.0');

    // Sticky: header stays at the top after the page scrolls.
    await page.mouse.wheel(0, 600);
    const box = await header.boundingBox();
    expect(box?.y ?? -1).toBeLessThanOrEqual(1);
  });

  test('CTA stays pinned to the right with empty slots (desktop)', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');

    const header = page.getByTestId('topbar');
    const cta = page.getByTestId('open-in-bruno');
    const brand = page.getByTestId('brand');

    const headerBox = await header.boundingBox();
    const ctaBox = await cta.boundingBox();
    const brandBox = await brand.boundingBox();

    // CTA hugs the right edge (within the 20px bar padding), not the brand.
    expect((headerBox!.x + headerBox!.width) - (ctaBox!.x + ctaBox!.width)).toBeLessThanOrEqual(24);
    expect(ctaBox!.x).toBeGreaterThan(brandBox!.x + brandBox!.width + 100);
  });

  test('brand shows the initials avatar derived from the collection name', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');

    // sampleCollection name is "Bruno Testbench" → "BT".
    const avatar = page.getByTestId('brand-initials');
    await expect(avatar).toBeVisible();
    await expect(avatar).toHaveText('BT');
  });

  test('Open-in-Bruno CTA deep-links via bruno://', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');

    const cta = page.getByTestId('open-in-bruno');
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute('href');
    expect(href).toMatch(/^bruno:\/\/app\/collection\/import\/git\?url=/);
  });

  test('mobile condenses: hamburger appears, Open-in-Bruno is hidden', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/');

    await expect(page.getByRole('button', { name: /toggle sidebar/i })).toBeVisible();
    // Open-in-Bruno is desktop-only (no Bruno desktop app on mobile).
    await expect(page.getByTestId('open-in-bruno')).toHaveCount(0);

    // Compact brand: avatar + "Docs" only — no full name, no version.
    await expect(page.getByTestId('brand-name')).toHaveText('Docs');
    await expect(page.getByTestId('brand-version')).toHaveCount(0);
    await expect(page.getByTestId('topbar')).not.toContainText('Bruno Testbench');

    // No horizontal overflow.
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollW).toBeLessThanOrEqual(MOBILE.width + 1);
  });
});

test.describe('Topbar — harness (slots filled)', () => {
  test('desktop renders search + env slots inline', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/?view=topbar-harness');

    await expect(page.getByTestId('search-slot-input')).toBeVisible();
    await expect(page.getByTestId('env-switcher-slot')).toBeVisible();
    // CTA shows on the desktop layout (always the full label variant).
    await expect(page.getByTestId('open-in-bruno')).toBeVisible();
  });

  test('tablet: hamburger + inline env, search collapsed to icon, no CTA', async ({ page }) => {
    await page.setViewportSize(TABLET);
    await page.goto('/?view=topbar-harness');

    await expect(page.getByRole('button', { name: /toggle sidebar/i })).toBeVisible();
    await expect(page.getByTestId('env-switcher-slot')).toBeVisible();
    // Search is an icon (no inline input) and Open-in-Bruno is hidden below desktop.
    await expect(page.getByTestId('search-slot-input')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /^search$/i })).toBeVisible();
    await expect(page.getByTestId('open-in-bruno')).toHaveCount(0);
  });

  test('tablet: search icon expands the search row', async ({ page }) => {
    await page.setViewportSize(TABLET);
    await page.goto('/?view=topbar-harness');

    await expect(page.getByTestId('search-slot-input')).toHaveCount(0);
    await page.getByRole('button', { name: /^search$/i }).click();
    await expect(page.getByTestId('search-slot-input')).toBeVisible();
  });

  test('mobile: search icon expands the search row', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/?view=topbar-harness');

    // Inline search is hidden on mobile until the toggle is pressed.
    await expect(page.getByTestId('search-slot-input')).toHaveCount(0);
    await page.getByRole('button', { name: /^search$/i }).click();
    await expect(page.getByTestId('search-slot-input')).toBeVisible();
  });

  test('mobile: overflow popover hosts the env-switcher slot', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/?view=topbar-harness');

    await expect(page.getByTestId('env-switcher-slot')).toHaveCount(0);
    await page.getByRole('button', { name: /more options/i }).click();
    await expect(page.getByTestId('env-switcher-slot')).toBeVisible();
  });

  test('mobile: hamburger invokes onToggleSidebar', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/?view=topbar-harness');

    await page.getByRole('button', { name: /toggle sidebar/i }).click();
    const calls = await page.evaluate(
      () => (window as unknown as { __toggleSidebarCalls?: number }).__toggleSidebarCalls
    );
    expect(calls).toBe(1);
  });
});
