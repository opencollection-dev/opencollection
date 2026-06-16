import { test, expect } from '@playwright/test';

/**
 * Page-based navigation (BRU-3188). Uses the nested-folder fixture mounted via
 * `?fixture=folders` (see dev.tsx) so we can exercise hierarchy, nested slugs,
 * auto-expand, prev/next and deep-link/reload stability.
 */
const FIXTURE = '/?fixture=folders';

const page$ = (s: string) => `${FIXTURE}#/${s}`;

test.describe('page-based navigation (BRU-3188)', () => {
  test('deep-link to a nested request renders only that page on a fresh load', async ({ page }) => {
    await page.goto(page$('bookings/lifecycle/create-booking'));

    const active = page.getByTestId('page');
    await expect(active).toHaveAttribute('data-page-slug', 'bookings/lifecycle/create-booking');
    await expect(active).toHaveAttribute('data-page-type', 'request');
    await expect(page.getByRole('heading', { name: 'Create Booking', level: 1 })).toBeVisible();

    // Other items are NOT rendered as page bodies (no single-scroll).
    await expect(page.getByRole('heading', { name: 'Login', level: 1 })).toHaveCount(0);
  });

  test('breadcrumb reflects the folder hierarchy', async ({ page }) => {
    await page.goto(page$('bookings/lifecycle/create-booking'));
    const bc = page.getByTestId('breadcrumb');
    await expect(bc).toContainText('Hotel API');
    await expect(bc).toContainText('Bookings');
    await expect(bc).toContainText('Lifecycle');
    await expect(bc).toContainText('Create Booking');
  });

  test('auto-expands ancestor folders so the deep-linked item is visible in the sidebar', async ({ page }) => {
    await page.goto(page$('bookings/lifecycle/create-booking'));
    // The sibling is only present in the DOM if Bookings + Lifecycle are expanded.
    await expect(page.locator('aside').getByText('Cancel Booking', { exact: true })).toBeVisible();
  });

  test('prev/next walks the hierarchy + seq order', async ({ page }) => {
    await page.goto(page$('bookings/lifecycle/create-booking'));

    const next = page.getByTestId('next-link');
    await expect(next).toContainText('Cancel Booking');
    await next.click();

    await expect(page.getByTestId('page')).toHaveAttribute(
      'data-page-slug',
      'bookings/lifecycle/cancel-booking'
    );
    await expect(page.getByTestId('prev-link')).toContainText('Create Booking');
  });

  test('slug URL is stable across reload', async ({ page }) => {
    await page.goto(page$('authentication/login'));
    await expect(page.getByRole('heading', { name: 'Login', level: 1 })).toBeVisible();

    await page.reload();
    await expect(page).toHaveURL(/#\/authentication\/login$/);
    await expect(page.getByRole('heading', { name: 'Login', level: 1 })).toBeVisible();
  });

  test('unknown slug redirects to the overview', async ({ page }) => {
    await page.goto(page$('does/not/exist'));
    await expect(page.getByTestId('page')).toHaveAttribute('data-page-type', 'overview');
  });

  test('clicking a sidebar item navigates to its slug route', async ({ page }) => {
    await page.goto(FIXTURE);
    await page.locator('[data-testid="sidebar-item"][data-slug="authentication"]').click();
    await expect(page.getByTestId('page')).toHaveAttribute('data-page-slug', 'authentication');
    await expect(page).toHaveURL(/#\/authentication$/);
  });
});
